import express from "express";

// Import the index controllers module
import { getIndex } from "../controllers/index.js";

// Create an Express router
const router = express.Router();

// Create a GET route
router.get("/", getIndex); // The first argument is the route path, the second argument is the controller function

// Export the router
export default router;
