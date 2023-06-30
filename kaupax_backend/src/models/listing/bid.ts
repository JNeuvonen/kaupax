import { Apartment } from "../../types/listing";
import { Realtor } from "../../types/realtor";

export const realtorHasAlreadyBid = (listing: Apartment, realtor: Realtor) => {
  let found = null;
  listing.Bid.forEach((bid) => {
    if (bid.realtorId === realtor.id) {
      found = bid;
    }
  });
  return found;
};
