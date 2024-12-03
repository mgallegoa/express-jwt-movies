import { MovieModel as movieModelLocal } from "../models/local/file-movies.js";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }
  getModel = () => {
    if (this.movieModel == null) {
      this.movieModel = movieModelLocal;
    }
    return this.movieModel;
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

  create = async (req, res) => {
    const result = validateMovie(req.body);
    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error) });
    }
    const movieCreated = await this.getModel().create({ data: result.data });
    return res.json(movieCreated);
  };

  update = async (req, res) => {
    const result = validatePartialMovie(req.body);
    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error) });
    }
    const { id } = req.params;
    const movieUpdated = await this.getModel().update({
      id,
      data: result.data,
    });
    return res.json(movieUpdated);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const movies = await this.getModel().delete({ id });
    if (movies) {
      return res.json(`Movie deleted, with id ${id}`);
    }
    return res.status(404).json(`Not Found, with id ${id}`);
  };
}
