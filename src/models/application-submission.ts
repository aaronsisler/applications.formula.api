import { ApplicationFieldData } from "./application-field-data";

export interface ApplicationSubmission {
  applicationId: string;
  applicationFieldData: ApplicationFieldData[];
}
