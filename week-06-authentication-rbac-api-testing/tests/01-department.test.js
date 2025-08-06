import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import {
  setupTestAuth,
  cleanupDatabase,
  disconnectPrisma,
} from "./helpers/auth.js";

describe("Department CRUD", () => {
  let institutionId;
  let departmentOneId;

  before(async () => {
    institutionId = global.testInstitutionId;
    console.log("Institution ID:", institutionId);
  });

  after(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  it("should create department one", async () => {
    const res = await request(app).post("/api/departments").send({
      name: "Information Technology",
      institutionId: institutionId,
    });

    console.log(res.body)
    expect(res.status).to.equal(201);
    const newDepartment = res.body.data.find(
      (department) => department.name === "Information Technology"
    );
    departmentOneId = newDepartment.id;
  });

  it("should get all departments", async () => {
    const res = await request(app).get("/api/departments");

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(1);
  });

  it("should get department one by ID", async () => {
    const res = await request(app).get(`/api/departments/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal("Information Technology");
  });

  it("should update department one", async () => {
    const res = await request(app)
      .put(`/api/departments/${departmentOneId}`)
      .send({
        name: "Nursing",
        institutionId: institutionId,
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully updated`
    );
    expect(res.body.data.name).to.equal("Nursing");
  });

  it("should delete department one", async () => {
    const res = await request(app).delete(
      `/api/departments/${departmentOneId}`
    );

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully deleted`
    );
  });
});
