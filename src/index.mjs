import express, { json } from "express";

const app = express();
app.disable("x-powered-by");
app.use(json());

app.get("/", (req, res) => res.end("server manuel test"));

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
