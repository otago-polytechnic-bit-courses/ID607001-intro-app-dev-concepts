import express from "express";
import cors from "cors";
import compression from "compression";
import healthRoutes from "./routes/health.js";
import institutionRoutes from "./routes/institution.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/institutions", institutionRoutes);

// Catch-all - must be last
app.use((req, res) => {
  return res.status(404).json({
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
