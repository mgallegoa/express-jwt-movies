import { MovieModel as movieModelLocal } from "../models/local/file-movies.js";

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }
  getModel = () => {
    // if (this.movieModel) {
    //   this.movieModel = MovieModel;
    // }
    return this.movieModel ?? movieModelLocal;
  };
  getAll = async (req, res) => {
    const { genre } = req.query;
    const movies = await this.getModel().getAll({ genre });
    res.json(movies);
  };
  getById = async (req, res) => {
    const { id } = req.params;
    const movie = await this.getModel().getById({ id });
    res.json(movie);
  };
}
