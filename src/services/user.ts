import { createHmac, randomBytes } from "node:crypto"
import { prismaClient } from "../lib/db.js"
import JWT from 'jsonwebtoken';

function getSecretKey() {
    const secretKey = process.env.SECRET_KEY
    if (!secretKey) {
        throw new Error("SECRET_KEY is not defined")
    }
    return secretKey
}


export interface createUserPayload{

    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface getUserTokenPayload{
    email:string,
    password:string
}

class userService{
    public static getUserById(id:string){
        return prismaClient.user.findUnique({where: {id}})
    }
    private static hashedPassword(salt:string, password: string){
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
        return hashedPassword
    }
    private static getUserByEmail(email:string){
        return prismaClient.user.findUnique({where : {email}})
    }
    public static async getUserToken(payload:getUserTokenPayload){
        const {email,password} = payload;
        const user = await userService.getUserByEmail(email)
        if (!user) throw new Error('user not found');
        const userSalt = user.salt
        const userPassword = user.password;
        const hashedUserPassword = userService.hashedPassword(userSalt,password);
        if (hashedUserPassword !== userPassword) throw new Error ('invalid password')
        const token = JWT.sign({ id: user.id, email: user.email }, getSecretKey())

        return token;

    }

    public static decodeUserToken(token: string){
        return JWT.verify(token, getSecretKey())
    }

    public static createuser(payload:createUserPayload){
        const { firstName,lastName,email,password}  = payload
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = userService.hashedPassword(salt,password);

        return prismaClient.user.create({
            data:{
                firstName,
                lastName,
                email,
                salt,
                password:hashedPassword
            }
        })
    }
}

export default userService
