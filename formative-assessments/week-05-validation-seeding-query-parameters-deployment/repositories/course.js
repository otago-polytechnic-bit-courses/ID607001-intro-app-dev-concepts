import prisma from "../prisma/db.js";

class CourseRepository {
  async create(data) {
    return prisma.course.create({ data });
  }

  async findAll() {
    return prisma.course.findMany();
  }

  async findById(id) {
    return prisma.course.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.course.delete({
      where: { id },
    });
  }
}

export default new CourseRepository();