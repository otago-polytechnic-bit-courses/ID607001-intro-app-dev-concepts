// Import the Express module
import express, { urlencoded, json } from "express";

// Import the auth middleware module
import authRouteMiddleware from "./middleware/authRoute.js";

// Import the auth routes module
import authRoutes from "./routes/auth.js";

// Import the institution routes module
import institutionRoutes from "./routes/institution.js";

// Import the department routes module
import departmentRoutes from "./routes/department.js";

// Create an Express application
const app = express();

app.use(urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads. For example, form data

app.use(json()); // To parse the incoming requests with JSON payloads. For example, REST API requests

// Use the auth routes module
app.use("/api/auth", authRoutes);

// Use the institution routes module
app.use("/api/institutions", authRouteMiddleware, institutionRoutes); // Authenticated routes

// Use the department routes module
app.use("/api/departments", departmentRoutes); // Non-authenticated routes

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000.");
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
