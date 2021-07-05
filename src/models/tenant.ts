export class Tenant {
  tenantId: string;
  tenantName: string;

  constructor(options: { tenantId?: string; tenantName?: string }) {
    this.tenantId = options.tenantId;
    this.tenantName = options.tenantName;
  }
}
