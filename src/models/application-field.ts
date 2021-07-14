import { InputFieldType } from "./input-field-type";

export class ApplicationField {
  applicationId: string;
  applicationFieldId: string;
  applicationSequence: number;
  inputFieldType: InputFieldType;
  inputFieldLabel: string;
  inputFieldName: string;

  constructor(options: {
    applicationId: string;
    applicationFieldId: string;
    applicationSequence?: number;
    inputFieldType?: InputFieldType;
    inputFieldLabel?: string;
    inputFieldName?: string;
  }) {
    this.applicationId = options.applicationId;
    this.applicationFieldId = options.applicationFieldId;
    this.applicationSequence = options.applicationSequence;
    this.inputFieldType = options.inputFieldType;
    this.inputFieldLabel = options.inputFieldLabel;
    this.inputFieldName = options.inputFieldName;
  }
}
