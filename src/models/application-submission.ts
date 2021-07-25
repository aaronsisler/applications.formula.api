import { ApplicationFieldData } from "./application-field-data";

export class ApplicationSubmission {
  applicationId: string;
  applicationFieldData: ApplicationFieldData[];

  constructor(options: {
    applicationId?: string;
    applicationFieldData?: ApplicationFieldData[];
  }) {
    this.applicationId = options.applicationId;
    this.applicationFieldData = options.applicationFieldData;
  }
}
