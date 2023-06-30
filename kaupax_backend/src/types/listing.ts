import { Bid } from "./realtor";

export interface Apartment {
  id: number;
  lng: number;
  lat: number;
  street: string;
  city: string;
  addressFull: string;
  country: string;
  surfaceArea: number;
  floor: null;
  condition: string;
  yearBuilt: null;
  listingType: string;
  listersEmail: string;
  objective?: string;
  freeDescription?: string;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  listingClosed: null;
  usersEstimateOfPrice: number | null;
  realtorId: null;
  listersPhone: string;
  clientId: number;
  ProfilePicture: null;
  Picture: any[];
  cluster?: boolean;
  Bid: Bid[];
}
