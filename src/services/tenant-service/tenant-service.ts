import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { DatabaseService } from "../database-service";
import { Tenant } from "../../models/tenant";
import { TenantApplication } from "../../models/tenant-application";
import { databaseKeyParser } from "../../utils/database-key-parser";
import { errorLogger } from "../../utils/error-logger";

export class TenantService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(tenant: Tenant): Promise<void> {
    try {
      const tenantId: any = undefined;
      const applications: any = undefined;
      const item = {
        PartitionKey: `Tenant#${tenant.tenantId}`,
        SortKey: `Tenant#${tenant.tenantId}`,
        ...tenant,
        tenantId,
        applications
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:Tenant::create", error);
      throw new Error("Record not created");
    }
  }

  async get(tenantId: string): Promise<Tenant> {
    try {
      const rawTenent = await this.databaseService.getItem(
        `Tenant#${tenantId}`
      );

      const applications: TenantApplication[] = await this.getApplications(
        tenantId
      );

      const tenant = new Tenant({
        ...rawTenent,
        applications
      });

      return Promise.resolve(tenant);
    } catch (error) {
      errorLogger("Service:Tenant::get", error);
      throw new Error("Records not retrieved");
    }
  }

  async addApplication(tenantApplication: TenantApplication): Promise<void> {
    try {
      const item = {
        PartitionKey: `Tenant#${tenantApplication.tenantId}`,
        SortKey: `Application#${tenantApplication.applicationId}`,
        applicationName: tenantApplication.applicationName
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:Tenant::addApplication", error);
      throw new Error("Record not created");
    }
  }

  async getApplications(tenantId: string): Promise<TenantApplication[]> {
    try {
      const rawTenantApplications = await this.databaseService.getItems(
        `Tenant#${tenantId}`,
        "Application"
      );

      const tenantApplications = rawTenantApplications.map(
        (item: DocumentClient.AttributeMap) =>
          new TenantApplication({
            tenantId: databaseKeyParser(item.PartitionKey),
            applicationId: databaseKeyParser(item.SortKey),
            ...item
          })
      );

      return Promise.resolve(tenantApplications);
    } catch (error) {
      errorLogger("Service:Tenant::getApplications", error);
      throw new Error("Records not retrieved");
    }
  }
}
