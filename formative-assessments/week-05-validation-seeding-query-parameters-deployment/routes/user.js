import express from "express";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.js";

import { cacheMiddleware } from "../middleware/cache.js";

import {
  validatePostUser,
  validatePutUser,
} from "../middleware/validation/user.js";

const router = express.Router();

const MAX_CACHE_DURATION = 5 * 60 * 1000;

router.post("/", validatePostUser, createUser);
router.get("/", cacheMiddleware(MAX_CACHE_DURATION), getUsers);
router.get("/:id", cacheMiddleware(MAX_CACHE_DURATION), getUser);
router.put("/:id", validatePutUser, updateUser);
router.delete("/:id", deleteUser);

// Note: You can chain the routes like this -
// router.route("/").post(createUser).get(getUsers);

export default router;
