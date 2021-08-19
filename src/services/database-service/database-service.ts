import aws, { DynamoDB } from "aws-sdk";
import {
  DocumentClient,
  ExpressionAttributeValueMap
} from "aws-sdk/clients/dynamodb";

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
      errorLogger("Service:Database", error);
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
      errorLogger("Service:Database", error);
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

  async getItem(mainKey: string): Promise<DocumentClient.AttributeMap> {
    try {
      var params = {
        Key: { PartitionKey: mainKey, SortKey: mainKey },
        TableName: TABLE_NAME
      };
      const { Item } = await this.documentClient.get(params).promise();

      return Item;
    } catch (error) {
      errorLogger("Service:Database", error);
      throw new Error("Record not created");
    }
  }

  async getItems(
    partitionKey: string,
    sortKey: string = "empty"
  ): Promise<DocumentClient.ItemList> {
    try {
      const keyConditionExpression =
        this.getItemsKeyConditionExpression(sortKey);
      const expressionAttributeValues = this.getItemsExpressionAttributeValues(
        partitionKey,
        sortKey
      );

      var params = {
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        TableName: TABLE_NAME
      };
      const { Items } = await this.documentClient.query(params).promise();

      return Items;
    } catch (error) {
      errorLogger("Service:Database", error);
      throw new Error("Records not retrieved");
    }
  }

  private getItemsKeyConditionExpression(sortKey: string): string {
    if (sortKey === "empty") {
      return "begins_with ( PartitionKey , :partitionKey ) AND begins_with ( SortKey , :sortKey )";
    } else {
      return "PartitionKey = :partitionKey AND begins_with ( SortKey , :sortKey )";
    }
  }

  private getItemsExpressionAttributeValues(
    partitionKey: string,
    sortKey: string
  ): any {
    if (sortKey === "empty") {
      return {
        ":partitionKey": partitionKey,
        ":sortKey": partitionKey
      };
    } else {
      return {
        ":partitionKey": partitionKey,
        ":sortKey": sortKey
      };
    }
  }
}
