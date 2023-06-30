import { Listing } from "./listing";

export interface OAuthUser {
  user: OAuthUserInformation;
  expires: Date;
}

export interface OAuthUserInformation {
  name: string;
  email: string;
  image: string;
}

export interface User {
  id: number;
  password: null;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  street: null;
  city: null;
  postalArea: null;
  country: null;
  lat: null;
  lng: null;
  createdAt: Date;
  updatedAt: Date;
  Listing: Listing[];
}
