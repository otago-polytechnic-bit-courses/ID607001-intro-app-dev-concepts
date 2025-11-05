// Create a GET route
const getIndex = (req, res) => {
  return res.status(200).json({
    message: "Hello, World!",
    firstName: "John",
    lastName: "Doe",
    age: 20,
    hobbies: ["Reading", "Gaming", "Cooking"],
  });
};

// Export the getIndex function. May be used by other modules. For example, the index routes module
export { getIndex };
