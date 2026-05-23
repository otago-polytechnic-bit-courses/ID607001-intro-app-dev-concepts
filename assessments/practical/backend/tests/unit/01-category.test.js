// Write your import code here

describe("Category Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  describe("createCategories", () => {
    it("returns 201 and the new categories when the repository resolves successfully", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Read all
  // -----------------------------------------------------------------------
  describe("getCategories", () => {
    it("returns 200 and an array of categories when categories exist", async () => {
      // Write your test code here
    });

    it("returns 404 when no categories exist", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getCategory", () => {
    it("returns 200 and the category when it is found", async () => {
      // Write your test code here
    });

    it("returns 404 when the category is not found", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteCategory", () => {
    it("returns 200 when the category is found and deleted", async () => {
      // Write your test code here
    });

    it("returns 404 when the category to delete is not found", async () => {
      // Write your test code here
    });
  });
});
