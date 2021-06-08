import aws, { DynamoDB } from "aws-sdk";
import { QueryOutput } from "aws-sdk/clients/dynamodb";

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

  async getItem(mainKey: string): Promise<QueryOutput> {
    try {
      var params = {
        Key: { PartitionKey: mainKey, SortKey: mainKey },
        TableName: TABLE_NAME
      };
      return await this.documentClient.get(params).promise();
    } catch (error) {
      errorLogger("Service:Database", error);
      throw new Error("Record not created");
    }
  }

  async getItems(partitionKey: string, sortKey: string): Promise<QueryOutput> {
    try {
      var params = {
        KeyConditionExpression:
          "PartitionKey = :partitionKey AND begins_with ( SortKey , :sortKey )",
        ExpressionAttributeValues: {
          ":partitionKey": partitionKey,
          ":sortKey": sortKey
        },
        TableName: TABLE_NAME
      };
      return await this.documentClient.query(params).promise();
    } catch (error) {
      errorLogger("Service:Database", error);
      throw new Error("Record not created");
    }
  }
}

export { DatabaseService };
