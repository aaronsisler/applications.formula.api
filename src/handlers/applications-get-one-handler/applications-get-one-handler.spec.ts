import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGetApplicationWithApplicants: jest.Mock;
let mockGetApplicationWithFields: jest.Mock;

jest.mock("../../services/application-service", () => ({
  ApplicationService: jest.fn(() => ({
    getApplicationWithApplicants: mockGetApplicationWithApplicants,
    getApplicationWithFields: mockGetApplicationWithFields
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

  xdescribe("and when an application is retrieved", () => {
    beforeEach(() => {
      event = { pathParameters: { applicationId: "mock-application-id" } };
    });

    beforeEach(async () => {
      mockGetApplicationWithApplicants = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should attempt to get an application correctly", async () => {
      expect(mockGetApplicationWithApplicants).toHaveBeenCalledWith(
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

  xdescribe("and when an application is NOT retrieved", () => {
    beforeEach(async () => {
      mockGetApplicationWithApplicants = jest
        .fn()
        .mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to get an application correctly", async () => {
      expect(mockGetApplicationWithApplicants).toHaveBeenCalledWith(
        "mock-application-id"
      );
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
