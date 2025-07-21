import { MongoClient, ObjectId } from "mongodb";
import { config } from "dotenv";
config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connect() {
    if (!db) {
        await client.connect();
        db = client.db("riddles")
    }
    return db;
}

export function toObjectId(id) {
  return typeof id === 'string' ? new ObjectId(id) : id;
}

connect();