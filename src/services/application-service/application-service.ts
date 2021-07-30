import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { DatabaseService } from "../database-service";
import { QueueService } from "../queue-service";
import { Application } from "../../models/application";
import { ApplicationApplicant } from "../../models/application-applicant";
import { ApplicationField } from "../../models/application-field";
import { ApplicationSubmission } from "../../models/application-submission";
import { databaseKeyParser } from "../../utils/database-key-parser";
import { errorLogger } from "../../utils/error-logger";

export class ApplicationService {
  private databaseService: DatabaseService;
  private queueService: QueueService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.queueService = new QueueService();
  }

  async create(application: Application): Promise<void> {
    try {
      const applicationFields: any = undefined;
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

  async addApplicationFields(
    applicationFields: ApplicationField[]
  ): Promise<void> {
    try {
      const items: object[] = this.mapApplicationFields(applicationFields);

      return await this.databaseService.batchCreate(items);
    } catch (error) {
      errorLogger("Service:Application::addApplicationFields", error);
      throw new Error("Record not created");
    }
  }

  async submitApplication(
    applicationSubmission: ApplicationSubmission
  ): Promise<void> {
    try {
      return await this.queueService.enqueue(applicationSubmission);
    } catch (error) {
      errorLogger("Service:Application::submitApplication", error);
      throw new Error("Record not queued");
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

  async getApplicants(applicationId: string): Promise<ApplicationApplicant[]> {
    try {
      const rawApplicationFields = await this.databaseService.getItems(
        `Application#${applicationId}`,
        "Applicant"
      );

      const applicationApplicants: ApplicationApplicant[] =
        rawApplicationFields.map(
          (item: DocumentClient.AttributeMap) =>
            new ApplicationApplicant({
              applicationId: databaseKeyParser(item.PartitionKey),
              applicantId: databaseKeyParser(item.SortKey),
              ...item
            })
        );

      return Promise.resolve(applicationApplicants);
    } catch (error) {
      errorLogger("Service:Application::getApplicants", error);
      throw new Error("Records not retrieved");
    }
  }

  private mapApplicationFields(
    applicationFields: ApplicationField[]
  ): object[] {
    const mappedApplicationFields: object[] = applicationFields.map(
      (applicationField) => ({
        PartitionKey: `Application#${applicationField.applicationId}`,
        SortKey: `ApplicationField#${applicationField.applicationFieldId}`,
        ...applicationField,
        applicationId: undefined,
        applicationFieldId: undefined
      })
    );
    return mappedApplicationFields;
  }
}
