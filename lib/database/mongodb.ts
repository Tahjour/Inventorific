// lib\database\mongodb.ts
import { MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.nrje3.mongodb.net/?retryWrites=true&w=majority`;
let mongoClient = new MongoClient(uri);
let cachedClient: MongoClient | null = null;
export async function getConnectedClient() {
  if (cachedClient) {
    return cachedClient;
  }

  mongoClient = new MongoClient(uri);
  cachedClient = await mongoClient.connect();
  return cachedClient;
}

export async function closeDatabase() {
  return await mongoClient.close();
}
