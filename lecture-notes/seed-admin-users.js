import bcryptjs from "bcryptjs";

import prisma from "../client.js";
import { validatePostUser } from "../../middleware/validation/user.js";

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt();
  return bcryptjs.hash(password, salt);
};

// Simulate an Express-like request and response for validation
const validateUser = (user) => {
  const req = { body: user };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message.message);
        process.exit(1);
      },
    }),
  };

  validatePostUser(req, res, () => {}); // Pass an empty function since we're not using next()
};

const seedAdminUsers = async () => {
  try {
    // Delete all existing users
    await prisma.user.deleteMany();
    
    const userData = [
      {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
        password: "password123",
        role: "ADMIN",
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        emailAddress: "jane.doe@example.com",
        password: "password123",
        role: "ADMIN",
      },
    ];

    const data = await Promise.all(
      userData.map(async (user) => {
        validateUser(user);
        return { ...user, password: await hashPassword(user.password) };
      })
    );

    await prisma.user.createMany({
      data: data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Users successfully seeded");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedAdminUsers();
