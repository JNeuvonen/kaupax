export interface Apartment {
  id: number;
  lng: number;
  lat: number;
  street: string;
  isActive: boolean;
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
  updatedAt: Date;
  pictureAdded: boolean;
  listingClosed: null;
  realtorId: null;
  listersPhone: string;
  locality: string;
  congratulationsMessageSent: boolean;
  Picture: string[];
  profilePictureId: null;
  clientId: number;
  acceptedBidId: null;
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
  Realtor: Realtor;
  Message: Message[];
}

export interface Message {
  id: number;
  realtorId?: number;
  clientId?: number;
  content: string;
  createdAt: Date;
  listingId?: null;
  bidId?: number;
}

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
}

export interface ApartmentMapBoxFmt {
  type: "Feature";

  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: Apartment;
}

export interface ApartmentMapBoxFmtFuncRet {
  type: "FeatureCollection";
  features: ApartmentMapBoxFmt[];
}
