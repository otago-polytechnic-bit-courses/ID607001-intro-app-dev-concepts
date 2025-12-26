import request from "supertest";

import app from "../../app.js";
import { cleanupDatabase } from "./db.js";

const setupTestAuth = async () => {
  const user = {
    firstName: "Jane",
    lastName: "Doe",
    emailAddress: "jane.doe@example.com",
    password: "janedoe123",
    role: "ADMIN",
  };

  await cleanupDatabase();

  await request(app).post("/api/auth/register").send();

  const res = await request(app).post("/api/auth/login").send({
    emailAddress: user.emailAddress,
    password: user.password,
  });

  return res.body.token;
};

export default setupTestAuth;