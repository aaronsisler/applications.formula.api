import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { DatabaseService } from "../database-service";
import { QueueService } from "../queue-service";
import { Application } from "../../models/application";
import { ApplicationApplicant } from "../../models/application-applicant";
import { ApplicationFormGroup } from "../../models/application-form-group";
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
        "Application",
        `Application#${applicationId}`
      );

      const application = new Application({
        ...rawApplication
      });

      return Promise.resolve(application);
    } catch (error) {
      errorLogger("Service:Application::get", error);
      throw new Error("Records not retrieved");
    }
  }

  async getApplicationWithApplicants(
    applicationId: string
  ): Promise<Application> {
    try {
      const rawApplication = await this.databaseService.getItem(
        "Application",
        `Application#${applicationId}`
      );

      const applicationApplicants: ApplicationApplicant[] =
        await this.getApplicants(applicationId);

      const application = new Application({
        ...rawApplication,
        applicants: applicationApplicants
      });

      return Promise.resolve(application);
    } catch (error) {
      errorLogger("Service:Application::getApplicationWithApplicants", error);
      throw new Error("Records not retrieved");
    }
  }

  async getApplicationWithFormGroups(
    applicationId: string
  ): Promise<Application> {
    try {
      const rawApplication = await this.databaseService.getItem(
        "Application",
        `Application#${applicationId}`
      );

      const applicationFormGroups: ApplicationFormGroup[] =
        await this.getApplicationFormGroups(applicationId);

      const application = new Application({
        ...rawApplication,
        applicationFormGroups: applicationFormGroups
      });

      return Promise.resolve(application);
    } catch (error) {
      errorLogger("Service:Application::getApplicationWithFormGroups", error);
      throw new Error("Records not retrieved");
    }
  }

  async addApplicationFormGroups(
    applicationFormGroups: ApplicationFormGroup[]
  ): Promise<void> {
    try {
      const items: object[] = this.mapApplicationFormGroups(
        applicationFormGroups
      );

      return await this.databaseService.batchCreate(items);
    } catch (error) {
      errorLogger("Service:Application::addApplicationFormGroups", error);
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

  async getApplicationFormGroups(
    applicationId: string
  ): Promise<ApplicationFormGroup[]> {
    try {
      const rawApplicationFormGroups = await this.databaseService.getItems(
        `Application#${applicationId}`,
        "ApplicationFormGroup"
      );

      const applicationFormGroup: ApplicationFormGroup[] =
        rawApplicationFormGroups.map(
          (item: DocumentClient.AttributeMap) =>
            new ApplicationFormGroup({
              applicationId: databaseKeyParser(item.PartitionKey),
              applicationFormGroupId: databaseKeyParser(item.SortKey),
              ...item
            })
        );

      return Promise.resolve(applicationFormGroup);
    } catch (error) {
      errorLogger("Service:Application::getApplicationFormGroups", error);
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

  private mapApplicationFormGroups(
    applicationFormGroups: ApplicationFormGroup[]
  ): object[] {
    const mappedApplicationFormGroups: object[] = applicationFormGroups.map(
      (applicationFormGroup) => ({
        PartitionKey: `Application#${applicationFormGroup.applicationId}`,
        SortKey: `ApplicationFormGroup#${applicationFormGroup.applicationFormGroupId}`,
        ...applicationFormGroup,
        applicationId: undefined,
        applicationFormGroupId: undefined
      })
    );
    return mappedApplicationFormGroups;
  }
}
