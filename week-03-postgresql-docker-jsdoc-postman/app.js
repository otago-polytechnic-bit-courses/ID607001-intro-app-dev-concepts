import express from "express";
import cors from "cors";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

export default app;
