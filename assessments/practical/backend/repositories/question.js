import prisma from "../prisma/db.js";

const questionSelect = {
  id: true,
  text: true,
  correctAnswer: true,
  incorrectAnswers: true,
};

class QuestionRepository {
  async createMany(data) {
    return prisma.question.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAll() {
    return prisma.question.findMany({ select: questionSelect });
  }

  async findById(id) {
    return prisma.question.findUnique({
      where: { id },
      select: questionSelect,
    });
  }

  async findQuiz(quizId) {
    return prisma.question.findMany({
      where: { quizId },
      select: questionSelect,
    });
  }

  async update(id, data) {
    return prisma.question.update({
      where: { id },
      data,
      select: questionSelect,
    });
  }

  async delete(id) {
    return prisma.question.delete({
      where: { id },
    });
  }
}

export default new QuestionRepository();
