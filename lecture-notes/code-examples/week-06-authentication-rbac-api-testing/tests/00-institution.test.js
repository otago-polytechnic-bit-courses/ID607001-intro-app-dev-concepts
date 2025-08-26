import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import { setupTestAuth } from "./helpers/auth.js";

describe("Institution CRUD", () => {
  let token;
  let institutionOneId;
  let institutionTwoId;

  // Setup the test authentication before running the tests
  before(async () => {
    token = await setupTestAuth();
  });

  it("should create institution one", async () => {
    const res = await request(app)
      .post("/api/institutions")
      .set("Authorization", `Bearer ${token}`) // Set the Authorization header with the token
      .send({
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      });

    expect(res.status).to.equal(201);

    // Find an institution by name in the response body
    const newInstitution = res.body.data.find(
      (institution) => institution.name === "Otago Polytechnic"
    );
    institutionOneId = newInstitution.id; // Store the institution id for later use
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
    expect(res.body.data.length).to.be.at.least(2); // Check that there are at least 2 institutions
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
    global.testInstitutionId = institutionTwoId; // Store the institution id for later use in 01-department.test.js
  });
});
