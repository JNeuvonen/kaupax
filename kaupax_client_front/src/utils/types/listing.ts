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
  cluster?: boolean;
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
  Message: Message[];
}

export interface Message {
  content: string;
  realtorId?: number;
  clientId?: number;
  createdAt: Date;
  id: number;
}

export interface ListingDetailed {
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
  usersEstimateOfPrice: null;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  listingClosed: null;
  realtorId: null;
  listersPhone: string;
  locality: string;
  congratulationsMessageSent: boolean;
  clientId: number;
  acceptedBidId: null;
  ProfilePicture: null;
  Picture: any[];
  Bid: Bid[];
}

export interface Bid {
  id: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  listingId: number;
  bidAccepted: boolean;
  bidPending: boolean;
  comission: number;
  message: string;
  realtorId: number;
  Realtor: Realtor;
}

export interface Realtor {
  id: number;
  street: string;
  city: string;
  postalArea: string;
  country: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  company?: string;
  entreprenur?: boolean;
  licencedAgent: null;
  specialty: string[];
  languages: string[];
  lat: number;
  lng: number;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingMapBoxFmt {
  type: "Feature";

  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: Listing;
}

export interface ApartmentMapBoxFmtFuncRet {
  type: "FeatureCollection";
  features: ListingMapBoxFmt[];
}
