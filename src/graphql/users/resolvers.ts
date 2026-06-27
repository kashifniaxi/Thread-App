import type { createUserPayload,getUserTokenPayload } from "../../services/user.js";
import userService from "../../services/user.js";

const queries: Record<string, any> = {
    getUserToken:async (_: any,payload:getUserTokenPayload) => {
        const token = await userService.getUserToken(payload)
        return token
    },
    getCurrentlyLoggedInUser:async (_: any, parameters:any,context:any) => {
        const id  = context.user.id
        const user = await userService.getUserById(id)
        return user;
    }


}
const mutations: Record<string, any> = {
    createUser: async (_: any, payload:createUserPayload) => {
        const res = await userService.createuser(payload)
        return res.id
    },
}

export const resolvers = {queries, mutations}