// src/config/redis.js

import Redis from "ioredis";

const redis = new Redis(); // default: localhost:6379

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
