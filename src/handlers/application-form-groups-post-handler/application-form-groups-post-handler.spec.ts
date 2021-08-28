import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockAddApplicationFormGroups: jest.Mock;

jest.mock("../../services/application-service", () => ({
  ApplicationService: jest.fn(() => ({
    addApplicationFormGroups: mockAddApplicationFormGroups
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger");

describe("Handlers/ApplicationFormGroups:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    mockAddApplicationFormGroups = jest.fn().mockResolvedValue(undefined);
    event = {
      body: `[
          {
            "applicationId":"mock-application-id",
            "applicationFormGroupId":"mock-application-form-group-id",
            "applicationFormGroupSequence": 1,
            "formGroupType": "NAME"
          },
          {
            "applicationId":"mock-application-id",
            "applicationFormGroupId":"mock-application-form-group-id",
            "applicationFormGroupSequence": 2,
            "formGroupType": "NAME"
          }
        ]`
    };
  });

  describe("and when a list of application form groups are created", () => {
    beforeEach(async () => {
      await handler(event, undefined, callback);
    });

    it("should attempt to create application form groups correctly", async () => {
      expect(mockAddApplicationFormGroups).toHaveBeenCalled();
    });

    it("should return the correct response", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith(201, "Success");
    });

    it("should invoke the callback correctly", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
    });
  });

  describe("and when a list of application form groups are NOT created", () => {
    beforeEach(async () => {
      mockAddApplicationFormGroups = jest.fn().mockRejectedValue("mock-error");
      await handler(event, undefined, callback);
    });

    it("should attempt to create a list of application form groups correctly", async () => {
      expect(mockAddApplicationFormGroups).toHaveBeenCalled();
    });

    it("should log error messages correctly", () => {
      expect(errorLogger).toHaveBeenCalledWith(
        "Handler/ApplicationFormGroups:Post",
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
