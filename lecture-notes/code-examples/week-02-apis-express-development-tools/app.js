// Import the Express module
import express from "express";

// Import the index routes module
import indexRoutes from "./routes/index.js";

// Create an Express application
const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// Use the routes module
app.use("/", indexRoutes);

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
