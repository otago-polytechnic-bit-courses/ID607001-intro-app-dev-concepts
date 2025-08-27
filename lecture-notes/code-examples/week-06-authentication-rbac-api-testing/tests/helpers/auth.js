import request from "supertest";

import app from "../../app.js";
import { cleanupDatabase } from "./db.js";

const setupTestAuth = async () => {
  await cleanupDatabase();

  await request(app).post("/api/auth/register").send({
    firstName: "Jane",
    lastName: "Doe",
    emailAddress: "jane.doe@example.com",
    password: "janedoe123",
    role: "ADMIN",
  });

  const res = await request(app).post("/api/auth/login").send({
    emailAddress: "jane.doe@example.com",
    password: "janedoe123",
  });

  return res.body.token;
};

export default setupTestAuth;
