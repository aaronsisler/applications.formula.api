// Example Database Key: { S: User#9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d }
const databaseKeyParser = (databaseKey: string): string =>
  databaseKey.split("#")[1];

export { databaseKeyParser };
