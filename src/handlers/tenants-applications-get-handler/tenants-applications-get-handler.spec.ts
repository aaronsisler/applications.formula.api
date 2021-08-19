import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGetApplications: jest.Mock;

jest.mock("../../services/tenant-service", () => ({
  TenantService: jest.fn(() => ({
    getApplications: mockGetApplications
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/Tenants:Applications:Get", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
  });

  describe("when applications are retrieved for a tenant", () => {
    beforeEach(() => {
      event = { pathParameters: { tenantId: "mock-tenant-id" } };
    });

    beforeEach(async () => {
      mockGetApplications = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should attempt to get tenant's applications correctly", async () => {
      expect(mockGetApplications).toHaveBeenCalledWith("mock-tenant-id");
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
      mockGetApplications = jest.fn().mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to get tenant's applications correctly", async () => {
      expect(mockGetApplications).toHaveBeenCalledWith("mock-tenant-id");
    });

    it("should log error messages correctly", () => {
      expect(errorLogger).toHaveBeenCalledWith(
        "Handler/Tenants:Applications:Get",
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
