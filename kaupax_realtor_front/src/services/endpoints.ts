export const listingUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/${id}`;

export const bidUrl = (uuid: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/listing/bid/${uuid}`;
};

export const getPlacesAutoCompleteUrl = (input: string) =>
  `/api/google/places-autocomplete?input=${input}`;

export const addS3UrlToProfile = (userEmail: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/user/add-profile-pic?usersEmail=${userEmail}`;

export const updateRealtorProfileUrl = () => {
  return `${process.env.NEXT_PUBLIC_API_URL}/user/realtor-update-profile`;
};

export const getListingDetailed = (uuid: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/${uuid}/detailed`;

export const addMessageToListing = (id: number) =>
  `${process.env.NEXT_PUBLIC_API_URL}/listing/bid/${id}/add-message`;

export const createRealtorUrl = () => {
  return `${process.env.NEXT_PUBLIC_API_URL}/user/create-realtor`;
};

export const loginRealtorUrl = () => {
  return `${process.env.NEXT_PUBLIC_API_URL}/user/login-realtor`;
};

export const getRealtorProfileDetailed = `${process.env.NEXT_PUBLIC_API_URL}/user/realtor-profile`;
