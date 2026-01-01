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

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${process.env.API_BASE_URL}:${PORT}`
  );
});

export default app;
