import { expect } from "chai";
import request from "supertest";

import app from "../app.js";
import setupTestAuth from "./helpers/auth.js";

describe("Institution CRUD", () => {
  const BASE_URL = "/api/institutions";

  let token;
  let institutionOneId;
  let institutionTwoId;

  const institutionData = [
    {
      name: "Ara Institute of Canterbury",
      region: "Canterbury",
      country: "New Zealand",
    },
    {
      name: "Otago Polytechnic",
      region: "Otago",
      country: "New Zealand",
    },
    {
      name: "Southern Institute of Technology",
      region: "Southland",
      country: "New Zealand",
    },
  ];

  // Setup the test authentication before running the tests
  before(async () => {
    token = await setupTestAuth();
  });

  it("should create institution one", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${token}`) // Set the Authorization header with the token
      .send(institutionData[1]);

    expect(res.status).to.equal(201);

    institutionOneId = res.body.data.id; // Store the institution ID for later use
  });

  it("should create institution two", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${token}`)
      .send(institutionData[2]);

    expect(res.status).to.equal(201);
    
    institutionTwoId = res.body.data.id;
  });

  it("should get all institutions", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(2); // Check that there are at least 2 institutions
  });

  it("should get institution one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${institutionOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(institutionData[1].name); // "Otago Polytechnic"
  });

  it("should update institution two", async () => {
    const res = await request(app).put(`${BASE_URL}/${institutionTwoId}`).send({
      name: institutionData[0].name,
      region: institutionData[0].region,
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionTwoId} successfully updated`,
    );
    expect(res.body.data.name).to.equal(institutionData[0].name);
  });

  it("should delete institution one", async () => {
    const res = await request(app).delete(`${BASE_URL}/${institutionOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionOneId} successfully deleted`,
    );
  });

  after(() => {
    global.testInstitutionId = institutionTwoId; // Store the institution ID for later use in 01-department.test.js
  });
});
