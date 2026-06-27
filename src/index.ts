import "dotenv/config";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import createGraphqlServer  from "./graphql/index.js";
import userService from "./services/user.js";



async function startServer() {
  const app = express();
const PORT = process.env.PORT || 8000;



app.get("/", (req, res) => {
  res.send("Hello World!");
});
// json body parser middleware
app.use(express.json());


// const server = await createGraphqlServer({});

app.use(
  "/graphql",
  expressMiddleware(await createGraphqlServer({}), {
    context: async ({ req }) => {
      const token = req.headers["tokens"];

      if (!token) {
        return { user: "user not found" };
      }

      try {
        const user = userService.decodeUserToken(token as string);
        return { user };
      } catch (err) {
        console.error("Invalid token:", err);
        return { user: null };
      }
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
}

await startServer();