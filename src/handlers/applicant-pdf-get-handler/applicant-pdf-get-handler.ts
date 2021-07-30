import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";

import { HandlerResponse } from "../../models/handler-response";
import { ApplicantService } from "../../services/applicant-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const applicantPdfSignedUrlGet: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const applicantService = new ApplicantService();
    const { pathParameters } = event;
    const { applicantId } = pathParameters;

    const result: string = await applicantService.getApplicantPdfSignedUrl(
      applicantId
    );

    const response: HandlerResponse = responseBodyBuilder(200, result);

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/ApplicantPdfSignedUrl:Get", error);
    const response: HandlerResponse = responseBodyBuilder(500, "Failure");

    callback(null, response);
  } finally {
    return;
  }
};

export { applicantPdfSignedUrlGet };
