// Write your import code here

describe("Auth Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Register
  // -----------------------------------------------------------------------
  describe("register", () => {
    it("returns 201 and does not include a password field when the user is new", async () => {
      // Write your test code here
    });

    it("returns 409 when the username already exists", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Login
  // -----------------------------------------------------------------------
  describe("login", () => {
    it("returns 200 and a token when credentials are valid", async () => {
      // Write your test code here
    });

    it("returns 401 when the user is not found", async () => {
      // Write your test code here
    });

    it("returns 401 when the password does not match", async () => {
      // Write your test code here
    });
  });
});