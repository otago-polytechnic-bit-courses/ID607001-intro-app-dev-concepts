import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return prisma.institution.create({ data });
  }

  async findAll() {
    return prisma.institution.findMany();
  }

  async findById(id) {
    return prisma.institution.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return prisma.institution.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.institution.delete({
      where: { id },
    });
  }
}

export default new InstitutionRepository();