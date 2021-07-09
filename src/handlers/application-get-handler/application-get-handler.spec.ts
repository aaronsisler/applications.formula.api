import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGet: jest.Mock;

jest.mock("../../services/application-service", () => ({
  ApplicationService: jest.fn(() => ({
    get: mockGet
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/Application:Get", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
  });

  describe("and when an application is retrieved", () => {
    beforeEach(() => {
      event = { pathParameters: { applicationId: "mock-application-id" } };
    });

    beforeEach(async () => {
      mockGet = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should attempt to get an application correctly", async () => {
      expect(mockGet).toHaveBeenCalledWith("mock-application-id");
    });

    xit("should return the correct response", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
    });

    it("should invoke the callback correctly", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
    });
  });

  describe("and when an application is NOT retrieved", () => {
    beforeEach(async () => {
      mockGet = jest.fn().mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to get an application correctly", async () => {
      expect(mockGet).toHaveBeenCalledWith("mock-application-id");
    });

    it("should log error messages correctly", () => {
      expect(errorLogger).toHaveBeenCalledWith(
        "Handler/Application:Get",
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
