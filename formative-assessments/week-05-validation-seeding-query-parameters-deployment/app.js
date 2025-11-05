import express from "express";
import cors from "cors";
import compression from "compression";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";
import departmentRoutes from "./routes/department.js";
import courseRoutes from "./routes/course.js";
import userRoutes from "./routes/user.js";

import isContentTypeApplicationJSON from "./middleware/contentType.js";

const app = express();

const PORT = process.env.PORT || 3000;

const BASE_URL = process.env.BASE_URL || "/api";

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/", indexRoutes);
app.use(`${BASE_URL}/institutions`, institutionRoutes);
app.use(`${BASE_URL}/departments`, departmentRoutes);
app.use(`${BASE_URL}/courses`, courseRoutes);
app.use(`${BASE_URL}/users`, userRoutes);
app.get(`${BASE_URL}/endpoints`, (req, res) => {
  res.json({
    endpoints: [
      // Institutions
      { method: "GET", path: "/api/institutions", description: "List all institutions" },
      { method: "GET", path: "/api/institutions/:id", description: "Get institution by ID" },
      { method: "POST", path: "/api/institutions", description: "Create institution" },
      { method: "PUT", path: "/api/institutions/:id", description: "Update institution" },
      { method: "DELETE", path: "/api/institutions/:id", description: "Delete institution" },
      
      // Departments
      { method: "GET", path: "/api/departments", description: "List all departments" },
      { method: "GET", path: "/api/departments/:id", description: "Get department by ID" },
      { method: "POST", path: "/api/departments", description: "Create department" },
      { method: "PUT", path: "/api/departments/:id", description: "Update department" },
      { method: "DELETE", path: "/api/departments/:id", description: "Delete department" },
    ],
  });
});
app.use((req, res) => {
  res.status(404).json({
    message: `${req.method} ${req.originalUrl} not found` 
  });
});

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

export default app;
