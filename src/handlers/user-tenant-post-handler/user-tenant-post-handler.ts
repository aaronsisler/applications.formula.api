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

const userTenantPost: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const userService = new UserService();
    const { body: rawBody } = event;
    const body = JSON.parse(rawBody);
    const userTenant: UserTenant = new UserTenant({ ...body });

    await userService.addTenant(userTenant);

    const response: HandlerResponse = responseBodyBuilder(201, "Success");

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/User:Tenant:Post", error);
    const response: HandlerResponse = responseBodyBuilder(500, "Failure");

    callback(null, response);
  } finally {
    return;
  }
};

export { userTenantPost };