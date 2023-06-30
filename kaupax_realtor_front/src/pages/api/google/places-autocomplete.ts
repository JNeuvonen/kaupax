import { getReq } from "@/services/util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.query.input;

  if (input) {
    const placesReq = await getReq({
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:fi&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    });
    res.status(200).send({ data: placesReq.res });
  } else {
    res.status(200).send({
      status: "input is empty",
    });
  }
}
