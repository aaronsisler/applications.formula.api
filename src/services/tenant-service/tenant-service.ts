import { DatabaseService } from "../database-service";
import { Tenant } from "../../models/tenant";
import { TenantApplication } from "../../models/tenant-application";
import { databaseKeyParser } from "../../utils/database-key-parser";
import { errorLogger } from "../../utils/error-logger";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class TenantService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async create(tenant: Tenant): Promise<void> {
    try {
      const item = {
        PartitionKey: `Tenant#${tenant.tenantId}`,
        SortKey: `Tenant#${tenant.tenantId}`,
        ...tenant
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:Tenant::create", error);
      throw new Error("Record not created");
    }
  }

  async get(tenantId: string): Promise<Tenant> {
    try {
      const { Item } = await this.databaseService.getItem(`Tenant#${tenantId}`);
      const tenant = new Tenant({ ...Item });
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
        applicantName: tenantApplication.applicantName
      };

      return await this.databaseService.create(item);
    } catch (error) {
      errorLogger("Service:Tenant::addApplication", error);
      throw new Error("Record not created");
    }
  }

  async getApplications(tenantId: string): Promise<TenantApplication[]> {
    try {
      const { Items } = await this.databaseService.getItems(
        `Tenant#${tenantId}`,
        "Application"
      );
      return Promise.resolve(
        Items.map(
          (item: DocumentClient.AttributeMap) =>
            new TenantApplication({
              tenantId: databaseKeyParser(item.PartitionKey),
              applicationId: databaseKeyParser(item.SortKey),
              ...item
            })
        )
      );
    } catch (error) {
      errorLogger("Service:Tenant::getApplications", error);
      throw new Error("Records not retrieved");
    }
  }
}
