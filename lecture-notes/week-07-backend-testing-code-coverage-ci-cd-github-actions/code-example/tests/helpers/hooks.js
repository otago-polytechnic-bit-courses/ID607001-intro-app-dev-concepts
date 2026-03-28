import dotenv from "dotenv";

dotenv.config({ path: ".env.test", override: true });

const { cleanupDatabase, disconnectPrisma } = await import("./db.js");

export const mochaHooks = {
  async beforeAll() {
    console.log(`Connected to database: ${process.env.DATABASE_URL}`);
    await cleanupDatabase();
    console.log(
      `Cleaned up database: ${process.env.DATABASE_URL} before running tests`,
    );
  },
  async afterAll() {
    await disconnectPrisma();
    console.log(`Disconnected from database: ${process.env.DATABASE_URL}`);
  },
};
