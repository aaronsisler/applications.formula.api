import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockAddApplicationFields: jest.Mock;

jest.mock("../../services/application-service", () => ({
  ApplicationService: jest.fn(() => ({
    addApplicationFields: mockAddApplicationFields
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
    mockAddApplicationFields = jest.fn().mockResolvedValue(undefined);
  });

  describe("when an application is to be created", () => {
    beforeEach(() => {
      event = {
        body: `[
          {
            "applicationId":"mock-application-id",
            "applicationFieldId":"mock-application-field-id",
            "applicationSequence": 1,
            "inputFieldType": "NAME"
          },
          {
            "applicationId":"mock-application-id",
            "applicationFieldId":"mock-application-field-id",
            "applicationSequence": 1,
            "inputFieldType": "NAME"
          }
        ]`
      };
    });

    describe("and when a list of application fields are created", () => {
      beforeEach(async () => {
        await handler(event, undefined, callback);
      });

      it("should attempt to create user correctly", async () => {
        expect(mockAddApplicationFields).toHaveBeenCalled();
      });

      it("should return the correct response", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
      });

      it("should invoke the callback correctly", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });

    describe("and when a list of application fields are NOT created", () => {
      beforeEach(async () => {
        mockAddApplicationFields = jest.fn().mockRejectedValue("mock-error");
        await handler(event, undefined, callback);
      });

      it("should attempt to create a list of application fields correctly", async () => {
        expect(mockAddApplicationFields).toHaveBeenCalled();
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "Handler/ApplicationFields:Post",
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
