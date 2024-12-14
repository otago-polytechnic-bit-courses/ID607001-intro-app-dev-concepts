import fetch from "node-fetch";
import bcryptjs from "bcryptjs";

import prisma from "../client.js";
import { validatePostUser } from "../../middleware/validation/user.js";

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt();
  return bcryptjs.hash(password, salt);
};

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

  validatePostUser(req, res, () => {});
};

const seedBasicUsers = async () => {
  try {
    const gistUrl = "https://gist.githubusercontent.com/Grayson-Orr/5004829989281843e1dcd517de59ed6e/raw/1fc51c8e00dda6aa6eb97295baeca3a8f9612d5a/seed-basic-users.json";
    const response = await fetch(gistUrl);
    const userData = await response.json();

    const data = await Promise.all(
      userData.map(async (user) => {
        validateUser(user);
        const hashedPassword = await hashPassword(user.password);
        return { ...user, password: hashedPassword };
      })
    );

    await prisma.user.createMany({
      data: data,
      skipDuplicates: true,
    });

    console.log("Users successfully seeded from GitHub Gist");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedBasicUsers();
