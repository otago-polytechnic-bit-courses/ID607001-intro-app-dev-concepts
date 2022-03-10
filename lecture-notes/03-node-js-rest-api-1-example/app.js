import express from "express";

// Access all the routes exported from routes/institutions.js
import institutions from "./routes/institutions.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// To make it clear to the consumer that the application is an API, prefix the endpoint with /api
app.use("/api/institutions", institutions);

// Listening on port 3000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});