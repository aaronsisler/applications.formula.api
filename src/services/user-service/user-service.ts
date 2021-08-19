import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { DatabaseService } from "../database-service";
import { User } from "../../models/user";
import { UserTenant } from "../../models/user-tenant";
import { databaseKeyParser } from "../../utils/database-key-parser";
import { errorLogger } from "../../utils/error-logger";

export class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(user: User): Promise<void> {
    try {
      const tenants: any = null;
      const item = {
        PartitionKey: "User",
        SortKey: `User#${user.userId}`,
        ...user,
        tenants
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:User::create", error);
      throw new Error("Record not created");
    }
  }

  async get(userId: string): Promise<User> {
    try {
      const rawUser = await this.databaseService.getItem(
        "User",
        `User#${userId}`
      );
      const user = new User({ ...rawUser });

      return Promise.resolve(user);
    } catch (error) {
      errorLogger("Service:User::get", error);
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
      const rawTenants = await this.databaseService.getItems(
        `User#${userId}`,
        "Tenant"
      );

      const tenants = rawTenants.map(
        (item: DocumentClient.AttributeMap) =>
          new UserTenant({
            userId: databaseKeyParser(item.PartitionKey),
            tenantId: databaseKeyParser(item.SortKey),
            ...item
          })
      );

      return Promise.resolve(tenants);
    } catch (error) {
      errorLogger("Service:User::getTenants", error);
      throw new Error("Records not retrieved");
    }
  }
}
