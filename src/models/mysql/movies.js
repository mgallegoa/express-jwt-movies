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
      return genre;
    }
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
       FROM movie;`,
    );
    return movies;
  }
}
