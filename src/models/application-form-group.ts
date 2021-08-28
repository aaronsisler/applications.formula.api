import { FormGroupType } from "./form-group-type";

export class ApplicationFormGroup {
  applicationId: string;
  applicationFormGroupId: string;
  applicationFormGroupSequence: string;
  formGroupType: FormGroupType;

  constructor(options: {
    applicationId?: string;
    applicationFormGroupId?: string;
    applicationFormGroupSequence?: string;
    formGroupType?: FormGroupType;
  }) {
    this.applicationId = options.applicationId;
    this.applicationFormGroupId = options.applicationFormGroupId;
    this.applicationFormGroupSequence = options.applicationFormGroupSequence;
    this.formGroupType = options.formGroupType;
  }
}
