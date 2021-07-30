import { ApplicantService } from "./index";

describe("services/ApplicantService", () => {
  let applicantService: ApplicantService;

  beforeEach(() => {
    applicantService = new ApplicantService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof ApplicantService).toEqual("function");
    expect(typeof applicantService).toEqual("object");
  });
});
