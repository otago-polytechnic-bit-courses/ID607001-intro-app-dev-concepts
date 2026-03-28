import prisma from "../db.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  let validationError = null;

  const res = {
    status: (code) => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostInstitution(req, res, () => {});

  if (validationError) {
    const errorMessage = typeof validationError === 'object' 
      ? JSON.stringify(validationError) 
      : validationError;
    throw new Error(errorMessage);
  }
};

export const seedInstitutions(). = async () => {
  const startTime = Date.now();
  const errors = [];

  try {
    // Delete all existing institutions
    await prisma.institution.deleteMany();

    const institutionData = [
      {
        country: "New Zealand",
      },
      {
        name: "Southern Institute of Technology",
        region: "Southland",
        country: "New Zealand",
      },
    ];

    const validatedData = [];
    for (const institution of institutionData) {
      try {
        validateInstitution(institution);
        validatedData.push(institution);
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (validatedData.length > 0) {
      await prisma.institution.createMany({
        data: validatedData,
        skipDuplicates: true,
      });
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    await prisma.$disconnect();
  }

  const time = ((Date.now() - startTime) / 1000).toFixed(1);

  return {
    resource: "Institutions",
    time,
    errors,
  };
};

seedInstitutions().then((report) => {
  console.log("==========================================");
  console.log("Seeding report");
  console.log("==========================================");
  console.log(`Resource: ${report.resource}`);
  console.log(`  Time taken: ${report.time}s`);
  if (report.errors.length > 0) {
    // Display error message
  } else {
    // Display no error message
  }
  console.log("==========================================");
});