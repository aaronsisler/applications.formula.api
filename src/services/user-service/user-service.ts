import { DatabaseService } from "../database-service";
import { errorLogger } from "../../utils/error-logger";

class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(): Promise<void> {
    try {
      const item = {
        PartitionKey: "User#123",
        SortKey: "User#123",
        FirstName: "Aaron",
        LastName: "Sisler"
      };

      await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:User", error);
      throw new Error("Record not created");
    }
  }
}

export { UserService };
