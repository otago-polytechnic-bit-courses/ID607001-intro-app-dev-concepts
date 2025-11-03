import prisma from "../client.js";

import { validatePostUser } from "../../middleware/validation/user.js";

// Simulate an Express-like request and response for validation
const validateUser = (user) => {
  const req = { body: user };
  let validationError = null;
  const res = {
    status: (code) => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostUser(req, res, () => {});

  if (validationError) {
    const errorMessage =
      typeof validationError === "object"
        ? JSON.stringify(validationError)
        : validationError;
    throw new Error(errorMessage);
  }
};

export const seedUsers = async () => {
  const startTime = Date.now();
  const errors = [];
  let count = 0;

  try {
    await prisma.user.deleteMany();

    const userData = [
      {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        emailAddress: "jane.doe@example.com",
      },
    ];

    const validatedData = [];
    for (const user of userData) {
      try {
        validateUser(user);
        validatedData.push(user);
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (validatedData.length > 0) {
      const result = await prisma.user.createMany({
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
    resource: "Users",
    count,
    time,
    errors,
  };
};
