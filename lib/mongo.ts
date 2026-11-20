import "server-only";
import { MongoClient, type Db } from "mongodb";

// One shared client per server instance (also survives Next.js dev hot reloads).
const g = globalThis as unknown as { __mongo?: Promise<MongoClient> };

export const hasDb = () => Boolean(process.env.MONGODB_URI);

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  g.__mongo ??= new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    .connect()
    .catch((e) => {
      g.__mongo = undefined; // allow a retry on the next call
      throw e;
    });
  const client = await g.__mongo;
  return client.db(process.env.MONGODB_DB || "portfolio");
}
