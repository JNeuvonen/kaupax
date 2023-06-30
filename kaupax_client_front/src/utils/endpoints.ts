export const getPlacesAutoCompleteUrl = (input: string) =>
  `/api/google/places-autocomplete?input=${input}`;

export const getGeocodeUrl = ({ lat, long }: { lat: string; long: string }) =>
  `/api/google/location-from-coords?lat=${lat}&long=${long}`;

export const getCoordsFromPlaceIdUrl = (placeId: string) =>
  `/api/google/coords-from-placeid?placeId=${placeId}`;

export const listingUrl = (uuid: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/${uuid}`;

export const getListingsUrl = `${process.env.NEXT_PUBLIC_API_URL}/listing/users/get`;

export const getListingDetailed = (uuid: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/${uuid}/detailed`;

export const addS3UrlToListing = (uuid: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/${uuid}/add-picture`;

export const removeS3UrlFromListing = (uuid: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/${uuid}/remove-picture`;

export const addMessageToListing = (id: number) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/bid/${id}/add-message`;

export const acceptBidEndpoint = (id: number) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/bid/${id}/accept`;

export const reactivateListingEndpoint = (uuid: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/bid/${uuid}/restart-bidding`;

export const getAllListings = `${process.env.NEXT_PUBLIC_API_URL}/listing/get/all`;

export const createUserUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/create`;

export const loginUserUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/login`;
