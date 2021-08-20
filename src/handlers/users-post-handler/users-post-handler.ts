import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";

import { HandlerResponse } from "../../models/handler-response";
import { User } from "../../models/user";
import { UserType } from "../../models/user-type";
import { UserService } from "../../services/user-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

export const usersPost: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const userService = new UserService();
    const { body: rawBody } = event;
    const body = JSON.parse(rawBody);
    const user: User = new User({
      userType: UserType.VISITOR,
      ...body
    });

    await userService.create(user);

    const response: HandlerResponse = responseBodyBuilder(201, "Success");

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/Users:Post", error);
    const response: HandlerResponse = responseBodyBuilder(500, "Failure");

    callback(null, response);
  } finally {
    return;
  }
};
