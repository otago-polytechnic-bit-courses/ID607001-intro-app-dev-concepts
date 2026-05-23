import quizRepository from "../repositories/quiz.js";
import categoryRepository from "../repositories/category.js";
import questionRepository from "../repositories/question.js";

const OPENTDB_API = "https://opentdb.com/api.php";

const createQuiz = async (req, res) => {
  try {
    const {
      title,
      categoryId,
      amount = 10,
      difficulty = "medium",
      type = "multiple",
    } = req.body;

    const category = await categoryRepository.findById(Number(categoryId));
    if (!category) {
      return res
        .status(404)
        .json({ message: `No category with the id: ${categoryId} found` });
    }

    const response = await fetch(
      `${OPENTDB_API}?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=${type}`,
    );
    const { results } = await response.json();

    if (!results || results.length < amount) {
      return res.status(400).json({
        message: `Not enough questions available. Requested ${amount} but only ${results?.length ?? 0} found for this category and difficulty.`,
      });
    }

    const quiz = await quizRepository.create({
      title,
      categoryId: Number(categoryId),
    });

    await questionRepository.createMany(
      results.map(({ question, correct_answer, incorrect_answers }) => ({
        text: question,
        correctAnswer: correct_answer,
        incorrectAnswers: incorrect_answers,
        quizId: quiz.id,
      })),
    );

    const quizWithQuestions = await quizRepository.findById(quiz.id);
    return res.status(201).json({
      message: "Quiz successfully created",
      data: quizWithQuestions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await quizRepository.findAll();
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found" });
    }
    return res.status(200).json({
      data: quizzes,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await quizRepository.findById(Number(id));
    if (!quiz) {
      return res.status(404).json({
        message: `No quiz with the id: ${id} found`,
      });
    }
    return res.status(200).json({
      data: quiz,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const existing = await quizRepository.findById(Number(id));
    if (!existing) {
      return res.status(404).json({
        message: `No quiz with the id: ${id} found`,
      });
    }

    if (existing.title === title) {
      return res.status(400).json({
        message: "New title must be different from the current title",
      });
    }

    const quiz = await quizRepository.update(Number(id), {
      title,
    });
    return res.status(200).json({
      message: `Quiz with the id: ${id} successfully updated`,
      data: quiz,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await quizRepository.findById(Number(id));
    if (!existing) {
      return res.status(404).json({
        message: `No quiz with the id: ${id} found`,
      });
    }
    await quizRepository.delete(Number(id));
    return res.status(200).json({
      message: `Quiz with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export { createQuiz, getQuizzes, getQuiz, updateQuiz, deleteQuiz };
