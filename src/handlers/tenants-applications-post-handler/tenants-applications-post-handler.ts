import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";

import { HandlerResponse } from "../../models/handler-response";
import { TenantApplication } from "../../models/tenant-application";
import { TenantService } from "../../services/tenant-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

export const tenantsApplicationsPost: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const tenantService = new TenantService();
    const { body: rawBody } = event;
    const body = JSON.parse(rawBody);
    const tenantApplication: TenantApplication = new TenantApplication({
      ...body
    });

    await tenantService.addApplication(tenantApplication);

    const response: HandlerResponse = responseBodyBuilder(201, "Success");

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/Tenant:Application:Post", error);
    const response: HandlerResponse = responseBodyBuilder(500, "Failure");

    callback(null, response);
  } finally {
    return;
  }
};
