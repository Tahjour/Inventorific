// lib\types\AuthenticationValues.ts
export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  cpassword: string;
}

export interface ItemValues {
  name: string;
  price: string;
  amount: string;
  description: string;
}