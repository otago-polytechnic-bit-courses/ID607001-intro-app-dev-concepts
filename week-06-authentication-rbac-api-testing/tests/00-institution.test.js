import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import {
  setupTestAuth,
  cleanupDatabase,
  disconnectPrisma,
} from "./helpers/auth.js";

describe("Institution CRUD", () => {
  let token;
  let institutionOneId;
  let institutionTwoId;

  before(async () => {
    token = await setupTestAuth();
  });

  it("should create institution one", async () => {
    const res = await request(app)
      .post("/api/institutions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      });

    expect(res.status).to.equal(201);
    const newInstitution = res.body.data.find(
      (institution) => institution.name === "Otago Polytechnic"
    );
    institutionOneId = newInstitution.id;
  });

  it("should create institution two", async () => {
    const res = await request(app)
      .post("/api/institutions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Southern Institute of Technology",
        region: "Southland",
        country: "New Zealand",
      });

    expect(res.status).to.equal(201);
    const newInstitution = res.body.data.find(
      (institution) => institution.name === "Southern Institute of Technology"
    );
    institutionTwoId = newInstitution.id;
  });

  it("should get all institutions", async () => {
    const res = await request(app).get("/api/institutions");

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(2);
  });

  it("should get institution one by ID", async () => {
    const res = await request(app).get(`/api/institutions/${institutionOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal("Otago Polytechnic");
  });

  it("should update institution two", async () => {
    const res = await request(app)
      .put(`/api/institutions/${institutionTwoId}`)
      .send({ name: "Ara Institute of Canterbury", region: "Canterbury" });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionTwoId} successfully updated`
    );
    expect(res.body.data.name).to.equal("Ara Institute of Canterbury");
  });

  it("should delete institution one", async () => {
    const res = await request(app).delete(
      `/api/institutions/${institutionOneId}`
    );

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionOneId} successfully deleted`
    );
  });

  after(() => {
    global.testInstitutionId = institutionTwoId;
  });
});
