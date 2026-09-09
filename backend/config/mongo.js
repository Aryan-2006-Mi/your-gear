const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

let mongoDB;

async function connectMongoDB() {
    try {
        await client.connect();

        mongoDB = client.db("your_gear");

        console.log("MongoDB connected successfully!");

        return mongoDB;
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}

function getMongoDB() {
    if (!mongoDB) {
        throw new Error("MongoDB is not connected yet.");
    }

    return mongoDB;
}

module.exports = {
    connectMongoDB,
    getMongoDB
};