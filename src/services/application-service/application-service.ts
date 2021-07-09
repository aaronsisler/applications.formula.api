import { DatabaseService } from "../database-service";
import { Application } from "../../models/application";
import { errorLogger } from "../../utils/error-logger";

export class ApplicationService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(application: Application): Promise<void> {
    try {
      const item = {
        PartitionKey: `Application#${application.applicationId}`,
        SortKey: `Application#${application.applicationId}`,
        ...application
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:Application::create", error);
      throw new Error("Record not created");
    }
  }

  async get(applicationId: string): Promise<Application> {
    try {
      const { Item } = await this.databaseService.getItem(
        `Application#${applicationId}`
      );
      const application = new Application({ ...Item });
      return Promise.resolve(application);
    } catch (error) {
      errorLogger("Service:Application::get", error);
      throw new Error("Records not retrieved");
    }
  }
}
