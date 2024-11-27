import { readJSON } from "../../utils/file-utils.js";

const movies = readJSON(import.meta.dirname + "/../../db/local/movies.json");

export class MovieModel {
  static getAll() {
    return movies;
  }
}
