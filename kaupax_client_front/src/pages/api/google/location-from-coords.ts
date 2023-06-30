import { getReq } from "@/services/util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, long } = req.query;

  if (lat && long) {
    const placesReq = await getReq({
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    });
    res.status(200).send({ data: placesReq.res });
  } else {
    res.status(200).send({
      status: "input is empty",
    });
  }
}
