import { ApplicationApplicant } from "./application-applicant";
import { ApplicationField } from "./application-field";

export class Application {
  applicationId: string;
  applicationName: string;
  applicationFields: ApplicationField[];
  applicants: ApplicationApplicant[];

  constructor(options: {
    applicationId?: string;
    applicationName?: string;
    applicationFields?: ApplicationField[];
    applicants?: ApplicationApplicant[];
  }) {
    this.applicationId = options.applicationId;
    this.applicationName = options.applicationName;
    this.applicationFields = options.applicationFields;
    this.applicants = options.applicants;
  }
}
