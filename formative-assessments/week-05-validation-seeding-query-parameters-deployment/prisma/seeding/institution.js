import prisma from "../client.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  const validationError = null;

  const res = {
    status: (code) => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostInstitution(req, res, () => {}); // Pass an empty function since we are not using next()

  if (validationError) {
    throw new Error(validationError.message);
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

    count = result.count;
  } catch (err) {
    errors.push(err.message);
  } finally {
    await prisma.$disconnect();
  }

  const time = ((Date.now() - startTime) / 1000).toFixed(1);

  return {
    resource: "Users",
    count,
    time,
    errors,
  };
};
