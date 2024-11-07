import dotenv from "dotenv";
dotenv.config();

import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const URI = process.env.URI; // Access the environment variable
const DATABASE_NAME = "taxi_mileage";
const COLLECTION_NAME = "shifts";

if (!URI) {
  throw new Error("MongoDB connection URI is not defined in environment variables.");
}

let cachedClient: MongoClient | null = null;
let isConnected = false; // Track connection state

async function connectToDatabase() {
  if (cachedClient && isConnected) {
    return cachedClient;
  }

  const client = new MongoClient(URI as string); // Type assertion here
  await client.connect();
  cachedClient = client; // Cache the client for reuse
  isConnected = true; // Update connection state
  return client;
}

async function getCollection() {
  const client = await connectToDatabase();
  const database = client.db(DATABASE_NAME);
  return database.collection(COLLECTION_NAME);
}

export async function GET() {
  try {
    const collection = await getCollection();
    const data = await collection.find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newShift = await request.json();
    const collection = await getCollection();
    await collection.insertOne(newShift);
    return NextResponse.json(newShift, { status: 201 });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ error: "Failed to insert data" }, { status: 500 });
  }
}