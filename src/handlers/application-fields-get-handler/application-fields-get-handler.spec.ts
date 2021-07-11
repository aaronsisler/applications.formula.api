import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGetApplicationFields: jest.Mock;

jest.mock("../../services/application-service", () => ({
  ApplicationService: jest.fn(() => ({
    getApplicationFields: mockGetApplicationFields
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/ApplicationFields:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    mockGetApplicationFields = jest.fn().mockResolvedValue(undefined);
  });

  describe("when application fields are retrieved for an application", () => {
    beforeEach(() => {
      event = { pathParameters: { applicationId: "mock-application-id" } };
    });

    beforeEach(async () => {
      mockGetApplicationFields = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should attempt to get application's application fields correctly", async () => {
      expect(mockGetApplicationFields).toHaveBeenCalledWith(
        "mock-application-id"
      );
    });

    xit("should return the correct response", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
    });

    it("should invoke the callback correctly", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
    });
  });

  describe("and when applications are NOT retrieved for a tenant", () => {
    beforeEach(async () => {
      mockGetApplicationFields = jest.fn().mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to get application's application fields correctly", async () => {
      expect(mockGetApplicationFields).toHaveBeenCalledWith(
        "mock-application-id"
      );
    });

    it("should log error messages correctly", () => {
      expect(errorLogger).toHaveBeenCalledWith(
        "Handler/ApplicationFields:Get",
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
