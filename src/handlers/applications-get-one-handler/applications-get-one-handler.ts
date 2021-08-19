import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";

import { HandlerResponse } from "../../models/handler-response";
import { Application } from "../../models/application";
import { ApplicationService } from "../../services/application-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

export const applicationsGetOne: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const applicationService = new ApplicationService();
    const { pathParameters, queryStringParameters = {} } = event;
    const { applicationId } = pathParameters;
    const { withApplicants, withFields } = queryStringParameters;

    let result: Application;

    if (!!withApplicants && !!withFields) {
      result = await applicationService.get(applicationId);
    }

    if (withApplicants) {
      result = await applicationService.getApplicationWithApplicants(
        applicationId
      );
    }

    if (withFields) {
      result = await applicationService.getApplicationWithFields(applicationId);
    }

    const response: HandlerResponse = responseBodyBuilder(200, result);

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/Applications:Get", error);
    const response: HandlerResponse = responseBodyBuilder(500, "Failure");

    callback(null, response);
  } finally {
    return;
  }
};
