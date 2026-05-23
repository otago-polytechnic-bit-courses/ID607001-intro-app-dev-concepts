import prisma from "../prisma/db.js";

const categorySelect = {
  id: true,
  name: true,
};

class CategoryRepository {
  async createMany(data) {
    return prisma.category.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAll() {
    return prisma.category.findMany({
      select: categorySelect,
    });
  }

  async findById(id) {
    return await prisma.category.findUnique({
      where: { id },
      select: categorySelect,
    });
  }

  async delete(id) {
    return await prisma.category.delete({
      where: { id },
      select: categorySelect,
    });
  }
}

export default new CategoryRepository();
