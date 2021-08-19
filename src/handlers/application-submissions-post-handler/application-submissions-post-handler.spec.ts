import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockSubmitApplication: jest.Mock;

jest.mock("../../services/application-service", () => ({
  ApplicationService: jest.fn(() => ({
    submitApplication: mockSubmitApplication
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/ApplicationSubmission:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    mockSubmitApplication = jest.fn().mockResolvedValue(undefined);
  });

  describe("when an application is to be submitted", () => {
    beforeEach(() => {
      event = {
        body: '{"applicationId":"mock-application-id","applicationFieldData":[]}'
      };
    });

    describe("and when application is submitted", () => {
      beforeEach(async () => {
        await handler(event, undefined, callback);
      });

      it("should attempt to submit application correctly", async () => {
        expect(mockSubmitApplication).toHaveBeenCalled();
      });

      it("should return the correct response", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
      });

      it("should invoke the callback correctly", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });

    describe("and when application is NOT submitted", () => {
      beforeEach(async () => {
        mockSubmitApplication = jest.fn().mockRejectedValue("mock-error");
        await handler(event, undefined, callback);
      });

      it("should attempt to submit application correctly", async () => {
        expect(mockSubmitApplication).toHaveBeenCalled();
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "Handler/ApplicationSubmission:Post",
          "mock-error"
        );
      });

      it("should return the correct response", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith(500, "Failure");
      });

      it("should invoke the callback correctly", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });
  });
});
