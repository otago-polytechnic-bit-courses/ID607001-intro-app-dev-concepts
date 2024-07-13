// Create a GET route
const get = (req, res) => {
  // req is an object that contains information about the HTTP request. res is an object that contains information about the HTTP response.
  return res.status(200).send("Hello, World!");
};

// Export the get function. May be used by other modules. For example, the index routes module
export { get };
