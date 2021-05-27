import { AuthService } from "./index";

describe("services/AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof AuthService).toEqual("function");
    expect(typeof authService).toEqual("object");
  });
});
