import dotenv from "dotenv";
dotenv.config();

import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const URI = process.env.URI; // Access the environment variable
const DATABASE_NAME = "taxi_mileage";
const COLLECTION_NAME = "shifts";

// let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (!URI) {
    throw new Error(
      "MongoDB connection URI is not defined in environment variables."
    );
  }

  const client = new MongoClient(URI);
  await client.connect();
  return client;
}

export async function GET() {
  const client = await connectToDatabase();
  const database = client.db(DATABASE_NAME);
  const collection = database.collection(COLLECTION_NAME);
  const data = await collection.find({}).toArray();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const newShift = await request.json();
  const client = await connectToDatabase();
  const database = client.db(DATABASE_NAME);
  const collection = database.collection(COLLECTION_NAME);
  await collection.insertOne(newShift);
  return NextResponse.json(newShift, { status: 201 });
}
