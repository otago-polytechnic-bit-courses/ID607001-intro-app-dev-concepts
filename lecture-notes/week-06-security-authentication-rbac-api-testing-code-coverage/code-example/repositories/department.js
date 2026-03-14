import prisma from "../prisma/db.js";

class DepartmentRepository {
  async create(data) {
    return prisma.department.create({ data });
  }

  async findAll() {
    return prisma.department.findMany();
  }

  async findById(id) {
    return prisma.department.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.department.delete({
      where: { id },
    });
  }
}

export default new DepartmentRepository();