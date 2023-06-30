export const googleGeoCodeUrl = (address: string) => {
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
};
