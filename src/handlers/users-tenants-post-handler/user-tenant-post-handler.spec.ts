import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockAddTenant: jest.Mock;

jest.mock("../../services/user-service", () => ({
  UserService: jest.fn(() => ({
    addTenant: mockAddTenant
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/Users:Tenants:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
  });

  describe("when a tenant is added to user", () => {
    beforeEach(() => {
      event = {
        body: '{"userId":"mock-user-id","tenantId":"mock-tenant-id"}'
      };
    });

    beforeEach(async () => {
      mockAddTenant = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should attempt to create user correctly", async () => {
      expect(mockAddTenant).toHaveBeenCalled();
    });

    it("should return the correct response", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
    });

    it("should invoke the callback correctly", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
    });
  });

  describe("and when tenant is NOT added to user", () => {
    beforeEach(async () => {
      mockAddTenant = jest.fn().mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to create user correctly", async () => {
      expect(mockAddTenant).toHaveBeenCalled();
    });

    it("should log error messages correctly", () => {
      expect(errorLogger).toHaveBeenCalledWith(
        "Handler/Users:Tenants:Post",
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
