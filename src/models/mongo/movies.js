import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri =
  process.ENV.MONGO_DATABASE_URL ??
  "mongodb+srv://mgallegoa:xxxxxxxxxxxxxxxx@manuelmongodb.hrlxt.mongodb.net/?retryWrites=true&w=majority&appName=ManuelMongoDb";

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
  static async create({ data }) {
    const connection = await connect();
    const { insertedId } = connection.insertOne(data);
    return {
      id: insertedId,
      ...data,
    };
  }
  static async update({ id, data }) {
    const connection = await connect();
    const objectId = new ObjectId({ id });
    const result = await connection.findOneAndUpdate(
      { _id: objectId },
      { $set: data },
      { returnDocument: "after" },
    );
    if (result) {
      return result;
    }
    return null;
  }
  static async delete({ id }) {
    const connection = await connect();
    const objectId = new ObjectId({ id });
    const { deletedCount } = await connection.deleteOne({ _id: objectId });
    return deletedCount > 0;
  }
}
