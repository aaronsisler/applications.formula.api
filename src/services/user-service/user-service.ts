import { DatabaseService } from "../database-service";
import { User } from "../../models/user";
import { UserTenant } from "../../models/user-tenant";
import { databaseKeyParser } from "../../utils/database-key-parser";
import { errorLogger } from "../../utils/error-logger";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(user: User): Promise<void> {
    try {
      const item = {
        PartitionKey: `User#${user.userId}`,
        SortKey: `User#${user.userId}`,
        ...user
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:User::create", error);
      throw new Error("Record not created");
    }
  }

  async get(userId: string): Promise<User> {
    try {
      const { Item } = await this.databaseService.getItem(`User#${userId}`);
      const user = new User({ ...Item });
      return Promise.resolve(user);
    } catch (error) {
      errorLogger("Service:User::getTenants", error);
      throw new Error("Records not retrieved");
    }
  }

  async addTenant(userTenant: UserTenant): Promise<void> {
    try {
      const item = {
        PartitionKey: `User#${userTenant.userId}`,
        SortKey: `Tenant#${userTenant.tenantId}`,
        tenantName: userTenant.tenantName
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:User::addTenant", error);
      throw new Error("Record not created");
    }
  }

  async getTenants(userId: string): Promise<UserTenant[]> {
    try {
      const { Items } = await this.databaseService.getItems(
        `User#${userId}`,
        "Tenant"
      );
      return Promise.resolve(
        Items.map(
          (item: DocumentClient.AttributeMap) =>
            new UserTenant({
              userId: databaseKeyParser(item.PartitionKey),
              tenantId: databaseKeyParser(item.SortKey),
              ...item
            })
        )
      );
    } catch (error) {
      errorLogger("Service:User::getTenants", error);
      throw new Error("Records not retrieved");
    }
  }
}
