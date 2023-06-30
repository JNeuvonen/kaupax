import { GeocodeAddress } from "../types/google";
import { googleGeoCodeUrl } from "../utils/constants";
import { getReq } from "./utils";

export async function geocodeAddress({ address }: { address: string }) {
  const url = googleGeoCodeUrl(address);

  const { status, res }: { status: number; res: GeocodeAddress } = await getReq(
    { url }
  );

  if (status !== 200) {
    return null;
  }

  return res;
}
