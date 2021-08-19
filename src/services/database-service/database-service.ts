import aws, { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { TABLE_NAME } from "../../config";
import { errorLogger } from "../../utils/error-logger";

export class DatabaseService {
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
      await this.documentClient.put(params).promise();
    } catch (error) {
      errorLogger("Service:Database:create", error);
      throw new Error("Record not created");
    }
  }

  async batchCreate(items: object[]): Promise<void> {
    try {
      const bacthItems = this.buildBatchItems(items);
      const params = {
        RequestItems: {
          [`${TABLE_NAME}`]: bacthItems
        }
      };
      console.log(params);
      await this.documentClient.batchWrite(params).promise();
    } catch (error) {
      errorLogger("Service:Database:batchCreate", error);
      throw new Error("Record not created");
    }
  }

  buildBatchItems(items: object[]) {
    return items.map((item) => {
      return {
        PutRequest: {
          Item: item
        }
      };
    });
  }

  async getItem(
    partitionKey: string,
    sortKey: string
  ): Promise<DocumentClient.AttributeMap> {
    try {
      var params = {
        Key: { PartitionKey: partitionKey, SortKey: sortKey },
        TableName: TABLE_NAME
      };
      const { Item } = await this.documentClient.get(params).promise();

      return Item;
    } catch (error) {
      errorLogger("Service:Database:getItem", error);
      throw new Error("Record not created");
    }
  }

  async getItems(
    partitionKey: string,
    sortKey: string
  ): Promise<DocumentClient.ItemList> {
    try {
      const params = {
        KeyConditionExpression:
          "PartitionKey = :partitionKey AND begins_with ( SortKey , :sortKey )",
        ExpressionAttributeValues: {
          ":partitionKey": partitionKey,
          ":sortKey": sortKey
        },
        TableName: TABLE_NAME
      };
      const { Items } = await this.documentClient.query(params).promise();

      return Items;
    } catch (error) {
      errorLogger("Service:Database:getItems", error);
      throw new Error("Records not retrieved");
    }
  }
}
