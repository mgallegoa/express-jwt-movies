import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://mgallegoa:n9haYTO0JktKVWIK@manuelmongodb.hrlxt.mongodb.net/?retryWrites=true&w=majority&appName=ManuelMongoDb";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    await client.connect();
    const db = client.db("database");
    return db.collection("movies");
  } catch (error) {
    console.log("Error in mongo connection", error);
    await client.close();
  }
}

export class MovieModel {
  static async getAll({ genre }) {
    const connection = await connect();
    if (genre) {
      return connection
        .find({
          genre: {
            $elemMatch: {
              $regex: genre,
              $options: "i",
            },
          },
        })
        .toArray();
    }
    return connection.find({}).toArray();
  }
  static async getById({ id }) {
    const connection = await connect();
    const objectId = new ObjectId({ id });
    return connection.findOne({ _id: objectId });
  }
}
