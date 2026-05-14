import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { prismaClient } from "./lib/db.js";


async function startServer() {
  const app = express();
const PORT = process.env.PORT || 8000;

// create graphql server
const server = new ApolloServer({
  typeDefs: `
    type Query {
      hello: String
      sayHello(name: String!): String
      getUsers: [User]
      getUserById(id: ID!): User
    }
    type User {
      id: ID!
      firstName: String!
      lastName: String!
      email: String!

    },
    type Mutation {
      createUser(firstName: String!,lastName:String!, email: String!, password: String!): Boolean
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello, world!",
      sayHello: (_: any, { name }: { name: string }) => `Hello, ${name}! , how are you doing?`,
      getUsers: () => prismaClient.user.findMany(),
      getUserById: (_: any, { id }: { id: string }) => prismaClient.user.findUnique({ where: { id:id } }),
    },
    Mutation: {
      createUser: async (_: any, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
        await prismaClient.user.create({
          data: {
            firstName,
            lastName,
            email,
            password,
            salt: "random_salt", // In a real application, generate a unique salt for each user
          },
        });
        return true;
      }
  },

}
});
await server.start();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// json body parser middleware
app.use(express.json());

app.use("/graphql", expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
}

await startServer();