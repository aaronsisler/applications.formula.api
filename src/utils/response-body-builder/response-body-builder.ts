import { HandlerResponse } from "../../models/handler-response";

const responseBodyBuilder = (
  statusCode: number,
  body: unknown
): HandlerResponse => {
  return { statusCode, body: JSON.stringify(body) };
};

export { responseBodyBuilder };
