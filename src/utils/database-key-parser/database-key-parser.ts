import { AttributeValue } from "aws-sdk/clients/dynamodb";

// Example Database Key: { S: User#9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d }
const databaseKeyParser = (databaseKey: AttributeValue): string =>
  databaseKey.S.split("#")[1];

export { databaseKeyParser };
