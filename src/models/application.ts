export class Application {
  applicationId: string;
  applicationName: string;

  constructor(options: { applicationId?: string; applicationName?: string }) {
    this.applicationId = options.applicationId;
    this.applicationName = options.applicationName;
  }
}
