import express, { json } from "express";
import { movieRouter } from "./routes/movies.js";

export const createApp = ({ movieModel }) => {
  const app = express();
  app.disable("x-powered-by");
  app.use(json());

  app.use("/movies", movieRouter({ movieModel }));

  const port = process.env.PORT ?? 3000;

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};
