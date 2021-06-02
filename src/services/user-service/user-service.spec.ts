import { UserService } from "./index";

describe("services/UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof UserService).toEqual("function");
    expect(typeof userService).toEqual("object");
  });
});
