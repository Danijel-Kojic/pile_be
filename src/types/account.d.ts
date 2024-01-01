export interface IAccount {
  id: string;
  iban: string;
  balance: number;
  currency: string;
  country: string;
  createdAt: Date;
  name: string;

  // Add any other fields as needed

  updatedAt?: Date;
};
