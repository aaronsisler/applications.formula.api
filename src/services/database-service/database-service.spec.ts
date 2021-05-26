import aws from "aws-sdk";
import { DatabaseService } from "./index";

jest.mock("aws-sdk", () => ({
  config: {
    update: jest.fn(),
  },
}));

describe("Services/DatabaseService", () => {
  let databaseService: DatabaseService;

  beforeEach(() => {
    databaseService = new DatabaseService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof DatabaseService).toEqual("function");
    expect(typeof databaseService).toEqual("object");
  });

  describe("when instantiated", () => {
    it("should update the configuration correctly", () => {
      expect(aws.config.update).toHaveBeenCalledWith({ region: "us-east-1" });
    });
  });
});