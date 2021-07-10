import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { DatabaseService } from "../database-service";
import { Application } from "../../models/application";
import { ApplicationField } from "../../models/application-field";
import { databaseKeyParser } from "../../utils/database-key-parser";
import { errorLogger } from "../../utils/error-logger";

export class ApplicationService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(application: Application): Promise<void> {
    try {
      const applicationFields: any = null;
      const item = {
        PartitionKey: `Application#${application.applicationId}`,
        SortKey: `Application#${application.applicationId}`,
        ...application,
        applicationFields
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:Application::create", error);
      throw new Error("Record not created");
    }
  }

  async get(applicationId: string): Promise<Application> {
    try {
      const rawApplication = await this.databaseService.getItem(
        `Application#${applicationId}`
      );

      const applicationFields: ApplicationField[] =
        await this.getApplicationFields(applicationId);

      const application = new Application({
        ...rawApplication,
        applicationFields: applicationFields
      });

      return Promise.resolve(application);
    } catch (error) {
      errorLogger("Service:Application::get", error);
      throw new Error("Records not retrieved");
    }
  }

  async getApplicationFields(
    applicationId: string
  ): Promise<ApplicationField[]> {
    try {
      const rawApplicationFields = await this.databaseService.getItems(
        `Application#${applicationId}`,
        "ApplicationField"
      );

      const applicationFields: ApplicationField[] = rawApplicationFields.map(
        (item: DocumentClient.AttributeMap) =>
          new ApplicationField({
            applicationId: databaseKeyParser(item.PartitionKey),
            applicationFieldId: databaseKeyParser(item.SortKey),
            ...item
          })
      );

      return Promise.resolve(applicationFields);
    } catch (error) {
      errorLogger("Service:Application::getApplicationFields", error);
      throw new Error("Records not retrieved");
    }
  }
}
