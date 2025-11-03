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

  validatePostUser(req, res, () => {}); // Pass an empty function since we are not using next()

  if (validationError) {
    throw new Error(JSON.stringify(validationError));
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

    const data = await Promise.all(
      userData.map(async (user) => {
        validateUser(user);
        return { ...user };
      })
    );

    const result = await prisma.user.createMany({
      data: data,
      skipDuplicates: true,
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
