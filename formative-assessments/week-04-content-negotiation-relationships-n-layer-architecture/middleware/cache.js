const cache = {};

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;

    const cachedResponse = cache[key];

    if (cachedResponse) {
      const currentTime = Date.now();
      const cacheAge = currentTime - cachedResponse.timestamp;
      const isExpired = cacheAge > duration;

      if (!isExpired) {
        res.setHeader("X-Cache", "HIT");
        return res.status(200).json(cachedResponse.data);
      } else {
        delete cache[key];
      }
    }
    const originalJson = res.json.bind(res); // If no cached response or cache is expired, proceed to the next middleware

    // Override the res.json method to store the response in cache
    res.json = (body) => {
      cache[key] = {
        // Store the response in cache
        data: body,
        timestamp: Date.now(),
      };

      res.setHeader("X-Cache", "MISS");

      return originalJson(body); // Call the original res.json method
    };

    next();
  };
};

const clearCache = () => {
  Object.keys(cache).forEach((key) => {
    delete cache[key];
  });
};

export { cacheMiddleware, clearCache };
