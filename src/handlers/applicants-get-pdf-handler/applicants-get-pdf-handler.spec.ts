import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGetApplicantPdfSignedUrl: jest.Mock;

jest.mock("../../services/applicant-service", () => ({
  ApplicantService: jest.fn(() => ({
    getApplicantPdfSignedUrl: mockGetApplicantPdfSignedUrl
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/Applicants:Get:PdfSignedUrl", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    event = { pathParameters: { applicantId: "mock-applicant-id" } };
    mockGetApplicantPdfSignedUrl = jest.fn().mockResolvedValue(undefined);
  });

  describe("when applicant pdf signed url is retrieved", () => {
    beforeEach(async () => {
      mockGetApplicantPdfSignedUrl = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should attempt to get applicant pdf signed url correctly", async () => {
      expect(mockGetApplicantPdfSignedUrl).toHaveBeenCalledWith(
        "mock-applicant-id"
      );
    });

    xit("should return the correct response", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
    });

    it("should invoke the callback correctly", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
    });
  });

  describe("when applicant pdf signed url is NOT retrieved", () => {
    beforeEach(async () => {
      mockGetApplicantPdfSignedUrl = jest.fn().mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to get application's application fields correctly", async () => {
      expect(mockGetApplicantPdfSignedUrl).toHaveBeenCalledWith(
        "mock-applicant-id"
      );
    });

    it("should log error messages correctly", () => {
      expect(errorLogger).toHaveBeenCalledWith(
        "Handler/Applicants:Get:PdfSignedUrl",
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
