import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return prisma.institution.create({ data });
  }

  async findAll(includeOptions = {}) {
    return prisma.institution.findMany({
      include: includeOptions,
    });
  }

  async findById(id, includeOptions = {}) {
    return prisma.institution.findUnique({
      where: { id },
      include: includeOptions,
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
