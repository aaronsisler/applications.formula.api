import { TenantApplication } from "./tenant-application";

export class Tenant {
  tenantId: string;
  tenantName: string;
  applications: TenantApplication[];

  constructor(options: {
    tenantId?: string;
    tenantName?: string;
    applications?: TenantApplication[];
  }) {
    this.tenantId = options.tenantId;
    this.tenantName = options.tenantName;
    this.applications = options.applications;
  }
}
