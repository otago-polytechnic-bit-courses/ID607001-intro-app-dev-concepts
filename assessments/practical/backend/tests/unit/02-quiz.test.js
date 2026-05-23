// Write your import code here

describe("Quiz Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  describe("createQuiz", () => {
    it("returns 201 and the new quiz when the category exists and the repository resolves successfully", async () => {
      // Write your test code here
    });

    it("returns 404 when the specified category does not exist", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Read all
  // -----------------------------------------------------------------------
  describe("getQuizzes", () => {
    it("returns 200 and an array of quizzes when quizzes exist", async () => {
      // Write your test code here
    });

    it("returns 404 when no quizzes exist", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getQuiz", () => {
    it("returns 200 and the quiz when it is found", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz is not found", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------
  describe("updateQuiz", () => {
    it("returns 200 and the updated quiz when the quiz exists", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz to update is not found", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteQuiz", () => {
    it("returns 200 when the quiz is found and deleted", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz to delete is not found", async () => {
      // Write your test code here
    });
  });
});
