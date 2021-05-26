import aws from "aws-sdk";

class DatabaseService {
  constructor() {
    aws.config.update({ region: "us-east-1" });
  }
}

export { DatabaseService };
