import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";

import { HandlerResponse } from "../../models/handler-response";
import { UserTenant } from "../../models/user-tenant";
import { UserService } from "../../services/user-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

export const usersTenantsGet: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const userService = new UserService();
    const { pathParameters } = event;
    const { userId } = pathParameters;

    const result: UserTenant[] = await userService.getTenants(userId);

    const response: HandlerResponse = responseBodyBuilder(200, result);

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/User:Tenant:Get", error);
    const response: HandlerResponse = responseBodyBuilder(500, "Failure");

    callback(null, response);
  } finally {
    return;
  }
};
