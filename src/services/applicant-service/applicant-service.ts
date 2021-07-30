import aws, { S3 } from "aws-sdk";

import { S3_BUCKET_NAME } from "../../config";
import { errorLogger } from "../../utils/error-logger";

export class ApplicantService {
  constructor() {}

  async getApplicantPdfSignedUrl(applicantId: string): Promise<string> {
    try {
      const s3: S3 = new aws.S3();
      const signedUrlExpireSeconds = 60; // your expiry time in seconds.

      return s3.getSignedUrl("getObject", {
        Bucket: S3_BUCKET_NAME,
        Key: `${applicantId}.pdf`,
        Expires: signedUrlExpireSeconds
      });
    } catch (error) {
      errorLogger("Service:Applicant::getApplicantPdfSignedUrl", error);
      throw new Error("Applicant pdf signed URL not retrieved");
    }
  }
}
