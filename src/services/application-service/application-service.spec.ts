import { ApplicationService } from "./index";

describe("services/ApplicationService", () => {
  let applicationService: ApplicationService;

  beforeEach(() => {
    applicationService = new ApplicationService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof ApplicationService).toEqual("function");
    expect(typeof applicationService).toEqual("object");
  });
});
