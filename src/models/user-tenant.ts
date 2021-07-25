export class UserTenant {
  userId: string;

  tenantId: string;

  tenantName: string;

  constructor(options: {
    userId: string;
    tenantId: string;
    tenantName?: string;
  }) {
    this.userId = options.userId;
    this.tenantId = options.tenantId;
    this.tenantName = options.tenantName;
  }
}
