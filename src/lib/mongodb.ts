import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options = {};

if (!uri) {
  throw new Error(
    '❌ MONGODB_URI no está definida en las variables de entorno',
  );
}

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
