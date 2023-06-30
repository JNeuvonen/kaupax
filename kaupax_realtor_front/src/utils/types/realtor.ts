export interface Realtor {
  id: number;
  city: null;
  postalArea: null;
  country: null;
  addressFull: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  password: null;
  company: string;
  entrepreneur: boolean;
  licencedAgent: boolean;
  biography: string;
  experienceInYears: null;
  specialty: any[];
  languages: any[];
  lat: number;
  lng: number;
  verified: boolean;
  verificationSubmitted: boolean;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
  Bid: Bid[];
}

export interface Bid {
  id: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  offerUpdated: Date;
  listingId: number;
  bidAccepted: boolean;
  bidPending: boolean;
  comission: number;
  message: string;
  realtorId: number;
  Listing: Listing;
}

export interface Listing {
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
  objective: null;
  freeDescription: null;
  listersEmail: string;
  usersEstimateOfPrice: number;
  uuid: string;
  createdAt: Date;
  acceptedBidId: null | number;
  isActive: boolean;
  updatedAt: Date;
  listingClosed: null;
  realtorId: null;
  listersPhone: string;
  locality: string;
  congratulationsMessageSent: boolean;
  clientId: number;
  ProfilePicture: null;
  Picture: any[];
}
