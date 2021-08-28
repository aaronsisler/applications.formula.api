import { ApplicationApplicant } from "./application-applicant";
import { ApplicationFormGroup } from "./application-form-group";

export class Application {
  applicationId: string;
  tenantId: string;
  applicationName: string;
  applicationFormGroups: ApplicationFormGroup[];
  applicants: ApplicationApplicant[];

  constructor(options: {
    applicationId?: string;
    tenantId?: string;
    applicationName?: string;
    applicationFormGroups?: ApplicationFormGroup[];
    applicants?: ApplicationApplicant[];
  }) {
    this.applicationId = options.applicationId;
    this.tenantId = options.tenantId;
    this.applicationName = options.applicationName;
    this.applicationFormGroups = options.applicationFormGroups;
    this.applicants = options.applicants;
  }
}
