import prisma from "../../prisma/client.js";

const cleanupDatabase = async () => {
  await prisma.department.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
};

const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export { cleanupDatabase, disconnectPrisma };
