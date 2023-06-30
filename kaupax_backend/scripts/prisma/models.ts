import prisma from "../../prisma/prisma";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import {
  getRandomCoordinatesWithinBounds,
  getRandomElementFromArr,
  getRandomValueWithinBounds,
} from "./funcs";
import {
  addresses,
  city,
  condition,
  country,
  listersEmail,
  listingType,
  phone,
  surfaceAreaBounds,
  usersEstimateOfPrice,
} from "../../prisma/seed-data";

export const client = async () => {
  const hashedPw = await bcrypt.hash("salasana123", 5);

  const data = {
    password: hashedPw,
    email: "neuvonenjarno@gmail.com",
    firstName: "Jarno",
    surname: "Neuvonen",
    phone: "+358451080041",
    street: "Koskelantie 30",
    city: "Helsinki",
    country: "Finland",
    lat: 60.20877,
    long: 24.94258,
    postalArea: "00150",
  };

  await prisma.client.create({ data });
};

export const listing = async ({ count }: { count: number }) => {
  for (let i = 0; i < count; i++) {
    const { lng, lat } = getRandomCoordinatesWithinBounds();
    const street = getRandomElementFromArr(addresses);
    const uuid = uuidv4();

    const data = {
      lng,
      lat,
      street: street,
      addressFull: street + ", Helsinki, Finland",
      city: getRandomElementFromArr(city),
      country: getRandomElementFromArr(country),
      surfaceArea: getRandomValueWithinBounds(surfaceAreaBounds, true),
      condition: getRandomElementFromArr(condition),
      listingType: getRandomElementFromArr(listingType),
      listersEmail: getRandomElementFromArr(listersEmail),
      usersEstimateOfPrice: getRandomValueWithinBounds(
        usersEstimateOfPrice,
        true
      ),
      listersPhone: getRandomElementFromArr(phone),
      uuid,
      locality: "Helsinki",
    };
    await prisma.listing.create({
      data,
    });
  }
};
