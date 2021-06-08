import { DatabaseService } from "../database-service";
import { errorLogger } from "../../utils/error-logger";
import { uuidGenerator } from "../../utils/uuid-generator";
import { User } from "../../models/user";
import { UserTenant } from "../../models/user-tenant";

class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(user: User): Promise<void> {
    try {
      const uuid = uuidGenerator();

      const item = {
        PartitionKey: `User#${uuid}`,
        SortKey: `User#${uuid}`,
        ...user
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:User::create", error);
      throw new Error("Record not created");
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

  async getTenants(userId: string): Promise<void> {
    try {
      return Promise.resolve();
    } catch (error) {
      errorLogger("Service:User::getTenants", error);
      throw new Error("Records not retrieved");
    }
  }
}

export { UserService };
