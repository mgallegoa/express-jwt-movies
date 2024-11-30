import { readJSON } from "../../utils/file-utils.js";

const movies = readJSON(import.meta.dirname + "/../../db/local/movies.json");

export class MovieModel {
  // getAll
  // getById
  // create
  // update
  // delete
  static async getAll({ genre }) {
    if (genre) {
      const moviesFiltered = movies.filter((item) => {
        return item.genre.some((g) => {
          return g.toLowerCase() === genre.toLowerCase();
        });
      });
      // const moviesFiltered = movies.filter((item) =>
      //   item.genre.some((g) => g.toUpperCase() === genre.toUpperCase()),
      // );
      return moviesFiltered;
    }
    return movies;
  }
  static async getById({ id }) {
    return movies.find((m) => m.id === id);
  }

  static async create({ data }) {
    const newMovie = {
      id: crypto.randomUUID(),
      ...data,
    };
    movies.push(newMovie);
    return newMovie;
  }
}
