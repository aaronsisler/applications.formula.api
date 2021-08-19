import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockCreate: jest.Mock;

jest.mock("../../services/user-service", () => ({
  UserService: jest.fn(() => ({
    create: mockCreate
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/User:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    mockCreate = jest.fn().mockResolvedValue(undefined);
  });

  describe("when a user is to be created", () => {
    beforeEach(() => {
      event = {
        body: '{"firstName":"mock-first-name","lastName":"mock-last-name"}'
      };
    });

    describe("and when user is created", () => {
      beforeEach(async () => {
        await handler(event, undefined, callback);
      });

      it("should attempt to create user correctly", async () => {
        expect(mockCreate).toHaveBeenCalled();
      });

      it("should return the correct response", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
      });

      it("should invoke the callback correctly", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });

    describe("and when user is NOT created", () => {
      beforeEach(async () => {
        mockCreate = jest.fn().mockRejectedValue("mock-error");
        await handler(event, undefined, callback);
      });

      it("should attempt to create user correctly", async () => {
        expect(mockCreate).toHaveBeenCalled();
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "Handler/User:Post",
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
