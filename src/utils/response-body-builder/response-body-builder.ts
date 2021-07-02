import { HandlerResponse } from "../../models/handler-response";

const baseResponse = {
  headers: {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work.
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS.
  }
};

const responseBodyBuilder = (
  statusCode: number,
  body: unknown
): HandlerResponse => {
  return { ...baseResponse, statusCode, body: JSON.stringify(body) };
};

export { responseBodyBuilder };
