export class ApplicationField {
  applicationId: string;
  applicationFieldId: string;
  inputFieldLabel: string;
  inputFieldName: string;

  constructor(options: {
    applicationId: string;
    applicationFieldId: string;
    inputFieldLabel?: string;
    inputFieldName?: string;
  }) {
    this.applicationId = options.applicationId;
    this.applicationFieldId = options.applicationFieldId;
    this.inputFieldLabel = options.inputFieldLabel;
    this.inputFieldName = options.inputFieldName;
  }
}
