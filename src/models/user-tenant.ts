export class UserTenant {
  tenantId: string;

  userId: string;

  tenantName: string;

  constructor(options: {
    tenantId?: string;
    userId?: string;
    tenantName?: string;
  }) {
    this.tenantId = options.tenantId;
    this.userId = options.userId;
    this.userId = options.userId;
    this.tenantName = options.tenantName;
  }
}
