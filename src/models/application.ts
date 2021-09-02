import { ApplicationApplicant } from "./application-applicant";
import { ApplicationField } from "./application-field";
import { ApplicationFormGroup } from "./application-form-group";

export class Application {
  applicationId: string;
  tenantId: string;
  applicationName: string;
  applicationFormGroups: ApplicationFormGroup[];
  applicationFields: ApplicationField[];
  applicants: ApplicationApplicant[];

  constructor(options: {
    applicationId?: string;
    tenantId?: string;
    applicationName?: string;
    applicationFormGroups?: ApplicationFormGroup[];
    applicationFields?: ApplicationField[];
    applicants?: ApplicationApplicant[];
  }) {
    this.applicationId = options.applicationId;
    this.tenantId = options.tenantId;
    this.applicationName = options.applicationName;
    this.applicationFormGroups = options.applicationFormGroups;
    this.applicationFields = options.applicationFields;
    this.applicants = options.applicants;
  }
}
