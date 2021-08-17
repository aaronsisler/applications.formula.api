export class User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isOnboarded: boolean = false;

  constructor(options: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    isOnboarded?: boolean;
  }) {
    this.userId = options.userId;
    this.firstName = options.firstName;
    this.lastName = options.lastName;
    this.email = options.email;
    this.isOnboarded = options.isOnboarded;
  }
}
