import mysql from "mysql2/promise";

const MYSQL_DATABASE_DEFAULT = {
  host: "localhost",
  port: 3306,
  user: "moviesUser",
  password: "2024SuperPw.Movies_bad",
  database: "moviesDb",
};

const connectionString =
  process.env.MYSQL_DATABASE_URL ?? MYSQL_DATABASE_DEFAULT;

const connection = await mysql.createConnection(connectionString);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const genreLowerCase = genre.toLowerCase();
      const [genres] = await connection.query(
        "SELECT id, name FROM genre WHERE name = ?;",
        [genreLowerCase],
      );
      if (genres.length === 0) {
        return [];
      }
      const [{ id }] = genres;
      const [movies] = await connection.query(
        `SELECT m.title, m.year, m.duration, m.poster, 
            m.rate, BIN_TO_UUID(m.id) id 
        FROM movie m, movie_genre mg 
        WHERE mg.genre_id = ? 
          AND mg.movie_id = m.id;`,
        [id],
      );
      return movies;
    }
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, 
          rate, BIN_TO_UUID(id) id 
       FROM movie;`,
    );
    return movies;
  }
  static async getById({ id }) {
    const [movie] = await connection.query(
      `SELECT title, year, director, duration, poster, 
          rate, BIN_TO_UUID(id) id 
       FROM movie
       WHERE id = UUID_TO_BIN(?);`,
      [id],
    );
    return movie;
  }
  static async create({ data }) {
    const { genre, title, year, director, duration, poster, rate } = data;
    const [binaryUUID] = await connection.query(
      "SELECT UUID_TO_BIN(uuid()) id;",
    );

    const result = await this.insertMovieGenre({
      binaryUUID: binaryUUID[0].id,
      genre,
    });
    if (result.error) {
      return { error: result.error };
    }
    const [movieInserted] = await connection.query(
      `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
          VALUES (?,?,?,?,?,?,?);`,
      [binaryUUID[0].id, title, year, director, duration, poster, rate],
    );
    if (movieInserted.affectedRows === 0) {
      return { error: `Movies not inserted. Binary UUID: ${binaryUUID[0].id}` };
    }
    const movieCreated = await this.getByBinaryUUID({
      binaryUUID: binaryUUID[0].id,
    });
    return movieCreated;
  }
  static async getByBinaryUUID({ binaryUUID }) {
    const [movie] = await connection.query(
      `SELECT title, year, director, duration, poster, 
          rate, BIN_TO_UUID(id) id 
       FROM movie
       WHERE id = ?;`,
      [binaryUUID],
    );
    return movie;
  }
  static async insertMovieGenre({ binaryUUID, genre }) {
    const [genreIds] = await connection.query(
      "SELECT id FROM genre g WHERE g.name IN (?);",
      [genre],
    );
    if (genreIds.length === 0) {
      return { error: `Genre must be a valid value. Value send: ${genre}` };
    }

    let values = new Array();
    for (const objectId of genreIds) {
      values.push(new Array(binaryUUID, objectId.id));
    }
    const [result] = await connection.query(
      "INSERT INTO movie_genre (movie_id, genre_id) VALUES ?;",
      [values],
    );
    if (result.affectedRows === 0) {
      return { error: "Genre and movies not inserted." };
    }
    return {};
  }
  static async update({ id, data }) {
    const { genre } = data;
    if (genre) {
      await connection.query(
        "DELETE FROM movie_genre WHERE movie_id = UUID_TO_BIN(?)",
        [id],
      );
      const [binaryUUID] = await connection.query("SELECT UUID_TO_BIN(?) id;", [
        id,
      ]);
      const result = await this.insertMovieGenre({
        binaryUUID: binaryUUID[0].id,
        genre,
      });
      if (result.error) {
        return { error: result.error };
      }
    }
    delete data.genre;
    const [result] = await connection.query(
      "UPDATE movie SET ? WHERE id = UUID_TO_BIN(?);",
      [data, id],
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return {
      id,
      genre,
      ...data,
    };
  }
  static async delete({ id }) {
    await connection.query(
      "DELETE FROM movie_genre WHERE movie_id = UUID_TO_BIN(?);",
      [id],
    );
    const [result] = await connection.query(
      "DELETE FROM movie WHERE id = UUID_TO_BIN(?);",
      [id],
    );
    if (result.affectedRows === 0) {
      return false;
    }
    return true;
  }
}
