import prisma from "../client.js";

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

export const seedInstitutions = async () => {
  const startTime = Date.now();
  const errors = [];
  let count = 0;

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
      const result = await prisma.institution.createMany({
        data: validatedData,
        skipDuplicates: true,
      });
      count = result.count;
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    await prisma.$disconnect();
  }

  const time = ((Date.now() - startTime) / 1000).toFixed(1);

  return {
    resource: "Institutions",
    count,
    time,
    errors,
  };
};
