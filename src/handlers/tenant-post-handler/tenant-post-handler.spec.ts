import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockCreate: jest.Mock;

jest.mock("../../services/tenant-service", () => ({
  TenantService: jest.fn(() => ({
    create: mockCreate
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/Tenant:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    mockCreate = jest.fn().mockResolvedValue(undefined);
  });

  describe("when a tenant is to be created", () => {
    beforeEach(() => {
      event = {
        body: '{"tenantId":"mock-tenant-id","tenantName":"mock-tenant-name"}'
      };
    });

    describe("and when tenant is created", () => {
      beforeEach(async () => {
        await handler(event, undefined, callback);
      });

      it("should attempt to create tenant correctly", async () => {
        expect(mockCreate).toHaveBeenCalled();
      });

      it("should return the correct response", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
      });

      it("should invoke the callback correctly", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });

    describe("and when tenant is NOT created", () => {
      beforeEach(async () => {
        mockCreate = jest.fn().mockRejectedValue("mock-error");
        await handler(event, undefined, callback);
      });

      it("should attempt to create tenant correctly", async () => {
        expect(mockCreate).toHaveBeenCalled();
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "Handler/Tenant:Post",
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
