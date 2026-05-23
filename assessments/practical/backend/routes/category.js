import express from "express";

import {
  createCategories,
  getCategories,
  getCategory,
  deleteCategory,
} from "../controllers/category.js";

import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";

const router = express.Router();

router.post("/", jwtAuth, rbac("CREATOR"), createCategories);
router.get("/", jwtAuth, getCategories);
router.get("/:id", jwtAuth, getCategory);
router.delete("/:id", jwtAuth, rbac("CREATOR"), deleteCategory);

export default router;
