import { UserType } from "./user-type";

export class User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;

  constructor(options: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    userType?: UserType;
  }) {
    this.userId = options.userId;
    this.firstName = options.firstName;
    this.lastName = options.lastName;
    this.email = options.email;
    this.userType = options.userType;
  }
}
