import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";

import { ApplicationField } from "../../models/application-field";
import { HandlerResponse } from "../../models/handler-response";
import { ApplicationService } from "../../services/application-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const applicationFieldsGet: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const applicationService = new ApplicationService();
    const { pathParameters } = event;
    const { applicationId } = pathParameters;

    const result: ApplicationField[] =
      await applicationService.getApplicationFields(applicationId);

    const response: HandlerResponse = responseBodyBuilder(201, result);

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/ApplicationFields:Get", error);
    const response: HandlerResponse = responseBodyBuilder(500, "Failure");

    callback(null, response);
  } finally {
    return;
  }
};

export { applicationFieldsGet };
