import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return await prisma.institution.create({ data });
  }

  async findAll() {
    return await prisma.institution.findMany();
  }

  async findById(id) {
    return await prisma.institution.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return await prisma.institution.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.institution.delete({
      where: { id },
    });
  }
}

export default new InstitutionRepository();