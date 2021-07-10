import { InputFieldType } from "./input-field-type";

export class ApplicationField {
  applicationId: string;
  applicationFieldId: string;
  applicationSequence: number;
  inputFieldType: InputFieldType;

  constructor(options: {
    applicationId: string;
    applicationFieldId: string;
    applicationSequence?: number;
    inputFieldType?: InputFieldType;
  }) {
    this.applicationId = options.applicationId;
    this.applicationFieldId = options.applicationFieldId;
    this.applicationSequence = options.applicationSequence;
    this.inputFieldType = options.inputFieldType;
  }
}
