import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGetTenants: jest.Mock;

jest.mock("../../services/user-service", () => ({
  UserService: jest.fn(() => ({
    getTenants: mockGetTenants
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/User:Tenant:Get", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    event = { pathParameters: { userId: "mock-user-id" } };
  });

  describe("when tenants are retrieved for a user", () => {
    beforeEach(async () => {
      mockGetTenants = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should attempt to get user's tenants correctly", async () => {
      expect(mockGetTenants).toHaveBeenCalledWith("mock-user-id");
    });

    xit("should return the correct response", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
    });

    it("should invoke the callback correctly", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
    });
  });

  describe("and when tenants are NOT retrieved for a user", () => {
    beforeEach(async () => {
      mockGetTenants = jest.fn().mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to get user's tenants correctly", async () => {
      expect(mockGetTenants).toHaveBeenCalledWith("mock-user-id");
    });

    it("should log error messages correctly", () => {
      expect(errorLogger).toHaveBeenCalledWith(
        "Handler/User:Tenant:Get",
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
