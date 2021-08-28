import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGetApplicationFormGroups: jest.Mock;

jest.mock("../../services/application-service", () => ({
  ApplicationService: jest.fn(() => ({
    getApplicationFormGroups: mockGetApplicationFormGroups
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
    mockGetApplicationFormGroups = jest.fn().mockResolvedValue(undefined);
  });

  describe("when application form groups are retrieved for an application", () => {
    beforeEach(() => {
      event = { pathParameters: { applicationId: "mock-application-id" } };
    });

    beforeEach(async () => {
      mockGetApplicationFormGroups = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should attempt to get application's application form groups correctly", async () => {
      expect(mockGetApplicationFormGroups).toHaveBeenCalledWith(
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

  describe("and when application form groups are NOT retrieved for a application", () => {
    beforeEach(async () => {
      mockGetApplicationFormGroups = jest.fn().mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to get application's application form groups correctly", async () => {
      expect(mockGetApplicationFormGroups).toHaveBeenCalledWith(
        "mock-application-id"
      );
    });

    it("should log error messages correctly", () => {
      expect(errorLogger).toHaveBeenCalledWith(
        "Handler/ApplicationFormGroups:Get",
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
