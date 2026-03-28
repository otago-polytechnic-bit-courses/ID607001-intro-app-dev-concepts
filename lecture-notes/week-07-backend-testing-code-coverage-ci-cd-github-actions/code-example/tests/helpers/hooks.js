import dotenv from "dotenv";

dotenv.config({ path: ".env.test", override: true });

const { cleanupDatabase, disconnectPrisma } = await import("./db.js");

export const mochaHooks = {
  async beforeAll() {
    console.log(`Connecting to database: ${process.env.DATABASE_URL}`);
    await cleanupDatabase();
    console.log("Database cleaned up");
  },
  async afterAll() {
    await disconnectPrisma();
    console.log(`Disconnected from database: ${process.env.DATABASE_URL}`);
  },
};
