import prisma from "../prisma/db.js";

class DepartmentRepository {
  async create(data) {
    return await prisma.department.create({ data });
  }

  async findAll() {
    return await prisma.department.findMany();
  }

  async findById(id) {
    return await prisma.department.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return await prisma.department.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.department.delete({
      where: { id },
    });
  }
}

export default new DepartmentRepository();