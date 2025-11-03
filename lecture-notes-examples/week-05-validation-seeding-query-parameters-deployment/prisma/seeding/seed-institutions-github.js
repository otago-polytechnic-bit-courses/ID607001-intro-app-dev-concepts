import fetch from "node-fetch";

import prisma from "../client.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message);
        process.exit(1);
      },
    }),
  };

  validatePostInstitution(req, res, () => {}); // Pass an empty function since we are not using next()
};

const seedInstitutionsFromGitHub = async () => {
  try {
    const gistUrl = "https://gist.githubusercontent.com/Grayson-Orr/8c18a8d452534cb6fe4b5688f2a2b080/raw/2f5b54f5ab3ca65a06294563abbf1cdbb63a5a26/week-05-seed-institutions-github.json";
    const response = await fetch(gistUrl);
    const institutionData = await response.json();

    const data = await Promise.all(
      institutionData.map(async (institution) => {
        validateInstitution(institution);
        return { ...institution };
      })
    );

    await prisma.institution.createMany({
      data: data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Institutions successfully seeded from GitHub Gist");
  } catch (err) {
    console.log(err.message);
  }
};

seedInstitutionsFromGitHub();