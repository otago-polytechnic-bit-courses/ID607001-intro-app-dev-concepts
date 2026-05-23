import categoryRepository from "../repositories/category.js";

const OPENTDB_API = "https://opentdb.com/api_category.php";

const createCategories = async (req, res) => {
  try {
    const response = await fetch(OPENTDB_API);
    const { trivia_categories } = await response.json();

    const categories = await categoryRepository.createMany(
      trivia_categories.map(({ id, name }) => ({ id, name })),
    );

    return res.status(201).json({
      message: "Categories successfully created",
      data: categories,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryRepository.findAll();
    if (!categories) {
      return res.status(404).json({ message: "No categories found" });
    }
    return res.status(200).json({
      data: categories,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryRepository.findById(Number(id));
    if (!category) {
      return res.status(404).json({
        message: `No category with the id: ${id} found`,
      });
    }
    return res.status(200).json({
      data: category,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryRepository.findById(Number(id));
    if (!category) {
      return res.status(404).json({
        message: `No category with the id: ${id} found`,
      });
    }
    await categoryRepository.delete(Number(id));
    return res.status(200).json({
      message: `Category with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export { createCategories, getCategories, getCategory, deleteCategory };
