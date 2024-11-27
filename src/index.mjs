import express, { json } from "express";
import { MovieModel } from "./models/local/file-movies.js";

const app = express();
app.disable("x-powered-by");
app.use(json());

app.get("/", (req, res) => res.json(MovieModel.getAll()));

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
