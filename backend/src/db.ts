import { MongoClient } from "mongodb";

export function getMongoClient() {
    return new MongoClient(process.env.MONGO_URL!)
}

export function getMongoCollection(client: MongoClient, name: string) {
    const db = client.db(process.env.MONGO_DB!)
    return db.collection(name)
}
