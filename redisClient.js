require("dotenv").config();
const redis = require("redis");

const maskedRedisUrl = process.env.REDIS_URL
    ? process.env.REDIS_URL.replace(/:(?!\/\/)[^:@]+@/, ":***@")
    : "REDIS_URL not set";

console.log("Using REDIS_URL:", maskedRedisUrl);

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on("error", (err) => {
    console.error("Redis Client Error:", err.message);
});

async function connectRedis() {
    await client.connect();
    console.log("Connected to Redis");
}

module.exports = { client, connectRedis };