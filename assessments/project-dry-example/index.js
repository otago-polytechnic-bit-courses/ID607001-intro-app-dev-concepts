// Import the Express module
import express, { urlencoded, json } from "express";

// Import the institution routes module
import institutionRoutes from "./routes/institution.js";

// Import the department routes module
import departmentRoutes from "./routes/department.js";

// Create an Express application
const app = express();

app.use(urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads. For example, form data

app.use(json()); // To parse the incoming requests with JSON payloads. For example, REST API requests

// Use the institution routes module
app.use("/api/institutions", institutionRoutes);

// Use the department routes module
app.use("/api/departments", departmentRoutes);

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000.");
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
