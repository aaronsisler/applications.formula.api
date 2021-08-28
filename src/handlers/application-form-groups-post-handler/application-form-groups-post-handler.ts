import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";

import { ApplicationFormGroup } from "../../models/application-form-group";
import { HandlerResponse } from "../../models/handler-response";
import { ApplicationService } from "../../services/application-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

export const applicationFormGroupsPost: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const applicationService = new ApplicationService();
    const { body: rawBody } = event;
    const body = JSON.parse(rawBody);
    const parsedApplicationFormGroups: ApplicationFormGroup[] = body.map(
      (applicationFormGroup: any) =>
        new ApplicationFormGroup({ ...applicationFormGroup })
    );

    await applicationService.addApplicationFormGroups(
      parsedApplicationFormGroups
    );

    const response: HandlerResponse = responseBodyBuilder(201, "Success");

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/ApplicationFormGroups:Post", error);
    const response: HandlerResponse = responseBodyBuilder(500, "Failure");

    callback(null, response);
  } finally {
    return;
  }
};
