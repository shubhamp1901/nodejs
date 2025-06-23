const { redisClient } = require("../redis/redisClient");


const checkCache = async (req, res, next) => {
  const key = req.path;
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached)});
    }
    res.locals.cacheKey = key;
    next();
  } catch (err) {
    console.error("Redis error:", err);
    next(); // fallback to handler even if Redis fails
  }
};

module.exports = checkCache;
