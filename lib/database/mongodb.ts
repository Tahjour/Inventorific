// lib\database\mongodb.ts
import { MongoClient, ServerApiVersion } from "mongodb";

export const MONGODB_URI = process.env.MONGODB_URI!;
let mongoClient = new MongoClient(MONGODB_URI);
let cachedClient: MongoClient | null = null;
export async function getConnectedClient() {
  if (cachedClient) {
    return cachedClient;
  }

  mongoClient = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  cachedClient = await mongoClient.connect();
  return cachedClient;
}

export async function closeDatabase() {
  return await mongoClient.close();
}
