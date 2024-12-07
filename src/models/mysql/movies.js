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
}
