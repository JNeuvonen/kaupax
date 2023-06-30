import { getReq } from "@/services/util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { placeId } = req.query;

  if (placeId) {
    const placesReq = await getReq({
      url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    });
    res.status(200).send({ data: placesReq.res });
  } else {
    res.status(200).send({
      status: "input is empty",
    });
  }
}
