import prisma from "../prisma/client.js";

class CourseRepository {
  async create(data) {
    return await prisma.course.create({ data });
  }

  async findAll() {
    return await prisma.course.findMany();
  }

  async findById(id) {
    return await prisma.course.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return await prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.course.delete({
      where: { id },
    });
  }
}

export default new CourseRepository();