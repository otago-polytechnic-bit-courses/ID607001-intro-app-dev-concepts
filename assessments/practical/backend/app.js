import express from "express";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import quizRoutes from "./routes/quiz.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/quizzes", quizRoutes);

/* c8 ignore next - cannot test app.listen in unit tests */
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`,
  );
});

export default app;
