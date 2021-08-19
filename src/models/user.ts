export class User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isOnboarded: boolean = false;
  isAdmin: boolean = false;

  constructor(options: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    isOnboarded?: boolean;
    isAdmin?: boolean;
  }) {
    this.userId = options.userId;
    this.firstName = options.firstName;
    this.lastName = options.lastName;
    this.email = options.email;
    this.isOnboarded = options.isOnboarded;
    this.isAdmin = options.isAdmin;
  }
}
