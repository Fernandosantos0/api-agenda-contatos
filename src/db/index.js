import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DB_SERVER);

async function connection() {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    return db.collection(process.env.COLLECTION);
}

export default connection;
