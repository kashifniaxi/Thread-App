import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";


async function startServer() {
  const app = express();
const PORT = process.env.PORT || 8000;

// create graphql server
const server = new ApolloServer({
  typeDefs: `
    type Query {
      hello: String
      sayHello(name: String!): String
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello, world!",
      sayHello: (_: any, { name }: { name: string }) => `Hello, ${name}! , how are you doing?`,
    },
  },
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