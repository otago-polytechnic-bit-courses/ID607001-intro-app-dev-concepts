import prisma from "../prisma/db.js";

const quizInclude = {
  category: {
    select: { id: true, name: true },
  },
  questions: {
    select: {
      id: true,
      text: true,
      correctAnswer: true,
      incorrectAnswers: true,
    },
  },
};

class QuizRepository {
  async create(data) {
    return prisma.quiz.create({
      data,
      include: quizInclude,
    });
  }

  async findAll() {
    return prisma.quiz.findMany({
      include: quizInclude,
    });
  }

  async findById(id) {
    return prisma.quiz.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        category: {
          select: { id: true, name: true },
        },
        questions: {
          select: {
            id: true,
            text: true,
            correctAnswer: true,
            incorrectAnswers: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return prisma.quiz.update({
      where: { id },
      data: {
        title: data.title,
      },
      include: quizInclude,
    });
  }

  async delete(id) {
    return prisma.quiz.delete({
      where: { id },
    });
  }
}

export default new QuizRepository();
