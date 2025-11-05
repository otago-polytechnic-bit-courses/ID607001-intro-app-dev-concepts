import request from "supertest";
import app from "../../app.js";
import prisma from "../../prisma/client.js";

export const setupTestAuth = async () => {
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  await request(app).post("/api/auth/register").send({
    firstName: "John",
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

export const cleanupDatabase = async () => {
  await prisma.department.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
