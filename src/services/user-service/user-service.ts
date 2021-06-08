import { DatabaseService } from "../database-service";
import { errorLogger } from "../../utils/error-logger";
import { uuidGenerator } from "../../utils/uuid-generator";
import { User } from "../../models/user";

class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(user: User): Promise<void> {
    try {
      const uuid = uuidGenerator();

      const item = {
        ...user,
        PartitionKey: `User#${uuid}`,
        SortKey: `User#${uuid}`
      };

      await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:User::create", error);
      throw new Error("Record not created");
    }
  }

  async addTenant(): Promise<void> {
    try {
      return Promise.resolve();
    } catch (error) {
      errorLogger("Service:User::addTenant", error);
      throw new Error("Record not created");
    }
  }
}

export { UserService };
