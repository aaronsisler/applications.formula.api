// Auth
// const TOKEN_HEADER = "x-forwarded-google-oauth-token";
const TOKEN_VALIDATION_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo";

// Database
const TABLE_NAME = "FORMULA_MAIN";

// Queue
const QUEUE_NAME = "FORMULA_APPLICATION_SUBMISSION";
const QUEUE_URL =
  "https://sqs.us-east-1.amazonaws.com/654918520080/FORMULA_APPLICATION_SUBMISSION";

export { QUEUE_NAME, QUEUE_URL, TABLE_NAME, TOKEN_VALIDATION_URL };
