export class User {
  firstName: string;

  lastName: string;

  constructor(options: { firstName?: string; lastName?: string }) {
    this.firstName = options.firstName;
    this.lastName = options.lastName;
  }
}
