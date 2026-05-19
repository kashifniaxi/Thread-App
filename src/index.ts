import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import createGraphqlServer  from "./graphql/index.js";


async function startServer() {
  const app = express();
const PORT = process.env.PORT || 8000;



app.get("/", (req, res) => {
  res.send("Hello World!");
});
// json body parser middleware
app.use(express.json());


const server = await createGraphqlServer({});

app.use("/graphql", expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
}

await startServer();