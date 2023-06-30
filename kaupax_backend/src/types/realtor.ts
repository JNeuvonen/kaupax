export interface Realtor {
  id: number;
  password: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalArea: string;
  country: string;
  lat: number;
  long: number;
  createdAt: Date;
  updatedAt: Date;
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
}
