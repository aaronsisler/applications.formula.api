import { InputFieldType } from "./input-field-type";

export class InputField {
  inputFieldId: string;

  inputFieldType: InputFieldType;

  constructor(options: {
    inputFieldId?: string;
    inputFieldType?: InputFieldType;
  }) {
    this.inputFieldId = options.inputFieldId;
    this.inputFieldType = options.inputFieldType;
  }
}
