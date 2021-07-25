import aws, { SQS } from "aws-sdk";

import { QUEUE_URL } from "../../config";
import { errorLogger } from "../../utils/error-logger";

export class QueueService {
  constructor() {
    aws.config.update({ region: "us-east-1" });
  }

  async enqueue(item: object): Promise<void> {
    try {
      const sqs: SQS = new aws.SQS();

      await sqs
        .sendMessage({ QueueUrl: QUEUE_URL, MessageBody: JSON.stringify(item) })
        .promise();
    } catch (error) {
      errorLogger("Service:QueueService", error);
      throw new Error("Record not enqueued");
    }
  }
}
