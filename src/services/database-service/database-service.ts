import aws, { DynamoDB } from "aws-sdk";

import { TABLE_NAME } from "../../config";
import { errorLogger } from "../../utils/error-logger";

class DatabaseService {
  private documentClient: DynamoDB.DocumentClient;

  constructor() {
    aws.config.update({ region: "us-east-1" });
    this.documentClient = new aws.DynamoDB.DocumentClient();
  }

  async create(item: object): Promise<void> {
    try {
      const params = {
        TableName: TABLE_NAME,
        Item: item
      };
      const result = await this.documentClient.put(params).promise();
      console.log(result);
    } catch (error) {
      errorLogger("Service:Database", error);
      throw new Error("Record not created");
    }
  }
}

export { DatabaseService };
