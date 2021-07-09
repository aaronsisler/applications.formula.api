export class TenantApplication {
  tenantId: string;
  applicationId: string;
  applicationName: string;

  constructor(options: {
    tenantId?: string;
    applicationId?: string;
    applicationName?: string;
  }) {
    this.tenantId = options.tenantId;
    this.applicationId = options.applicationId;
    this.applicationName = options.applicationName;
  }
}
