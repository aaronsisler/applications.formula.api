export class ApplicationApplicant {
  applicationId: string;
  applicantId: string;
  applicantName: string;
  dateSubmitted: string;

  constructor(options: {
    applicationId?: string;
    applicantId?: string;
    applicantName?: string;
    applicationUrl?: string;
    dateSubmitted?: string;
  }) {
    this.applicationId = options.applicationId;
    this.applicantId = options.applicantId;
    this.applicantName = options.applicantName;
    this.dateSubmitted = options.dateSubmitted;
  }
}
