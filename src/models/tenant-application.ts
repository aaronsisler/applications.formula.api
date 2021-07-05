export class TenantApplication {
  tenantId: string;
  applicationId: string;
  applicantName: string;

  constructor(options: {
    tenantId?: string;
    applicationId?: string;
    applicantName?: string;
  }) {
    this.tenantId = options.tenantId;
    this.applicationId = options.applicationId;
    this.applicantName = options.applicantName;
  }
}
