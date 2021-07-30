export class ApplicantSubmission {
  applicationId: string;
  applicantName: string;
  applicationUrl: string;
  dateSubmitted: string;

  constructor(options: {
    applicationId?: string;
    applicantName?: string;
    applicationUrl?: string;
    dateSubmitted?: string;
  }) {
    this.applicationId = options.applicationId;
    this.applicantName = options.applicantName;
    this.applicationUrl = options.applicationUrl;
    this.dateSubmitted = options.dateSubmitted;
  }
}
