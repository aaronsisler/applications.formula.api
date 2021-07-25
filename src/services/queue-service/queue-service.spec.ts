import aws from "aws-sdk";
import { QueueService } from "./index";

jest.mock("aws-sdk", () => ({
  config: {
    update: jest.fn()
  },
  SQS: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn()
  }))
}));

describe("Services/QueueService", () => {
  let queueService: QueueService;

  beforeEach(() => {
    queueService = new QueueService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof QueueService).toEqual("function");
    expect(typeof queueService).toEqual("object");
  });

  describe("when instantiated", () => {
    it("should update the configuration correctly", () => {
      expect(aws.config.update).toHaveBeenCalledWith({ region: "us-east-1" });
    });

    it("should create a new instance of the correct type", () => {
      // expect(aws.SQS).toHaveBeenCalled();
    });
  });
});
