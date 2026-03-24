import { expect } from "chai";
import request from "supertest";

import app from "../app.js";
import { cleanupDatabase, disconnectPrisma } from "./helpers/db.js";

describe("Department CRUD", () => {
  const BASE_URL = "/api/departments";

  let institutionId;
  let departmentOneId;

  const departmentData = [
    {
      name: "Information Technology",
    },
    {
      name: "Nursing",
    },
    {
      name: "Business",
    },
  ];

  // Set up the institution ID before running the tests
  before(async () => {
    institutionId = global.testInstitutionId;
  });

  // Clean up the database and disconnect Prisma after running the tests
  after(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  it("should create department one", async () => {
    const res = await request(app).post(BASE_URL).send({
      name: departmentData[0].name,
      institutionId: institutionId,
    });

    expect(res.status).to.equal(201);

    departmentOneId = res.body.data.id;
  });

  it("should get all departments", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(1);
  });

  it("should get department one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(departmentData[0].name);
  });

  it("should update department one", async () => {
    const res = await request(app).put(`${BASE_URL}/${departmentOneId}`).send({
      name: departmentData[1].name,
      institutionId: institutionId,
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully updated`
    );
    expect(res.body.data.name).to.equal(departmentData[1].name);
  });

  it("should delete department one", async () => {
    const res = await request(app).delete(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully deleted`
    );
  });
});