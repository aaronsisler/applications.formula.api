import { responseBodyBuilder } from "./index";
import { HandlerResponse } from "../../models/handler-response";

describe("utils - Response Body Builder", () => {
  let handlerResponse: HandlerResponse;
  const mockBody = { returned: "value" };

  beforeEach(() => {
    handlerResponse = responseBodyBuilder(200, mockBody);
  });

  it("should return the status code", () => {
    const { statusCode } = handlerResponse;

    expect(statusCode).toEqual(200);
  });

  it("should return the correct response body", () => {
    const { body } = handlerResponse;

    expect(body).toEqual(JSON.stringify(mockBody));
  });
});
