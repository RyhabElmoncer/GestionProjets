export class Address {
  constructor(
      public street: string,
      public city: string,
      public state: string,
      public country: string,
      public zip: string
  ) {}
}
export class User {
  constructor(
      public id: string,
      public firstname: string,
      public lastname: string,
      public email: string,
      public  phoneNumber: number,
      public role: string,
      public type: string,
      public note: string,
      public taxRegistrationNumber: string,
      public monthlyIncome : string,
      public occupation: string,
      public numAssurance: string,
      public phoneFix: string,
      public privilegeStrings: string[],
      public imageUrl: string,
      public status?: string,
      public enabled? : boolean,
      public taxRegistered? : boolean,
      public address?: Address,


  ) {
  }
}
