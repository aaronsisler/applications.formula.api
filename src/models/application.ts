import { ApplicationField } from "./application-field";

export class Application {
  applicationId: string;
  applicationName: string;
  applicationFields: ApplicationField[];

  constructor(options: {
    applicationId?: string;
    applicationName?: string;
    applicationFields?: ApplicationField[];
  }) {
    this.applicationId = options.applicationId;
    this.applicationName = options.applicationName;
    this.applicationFields = options.applicationFields;
  }
}
