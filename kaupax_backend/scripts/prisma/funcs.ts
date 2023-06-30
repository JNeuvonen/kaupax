import { latBounds, longBounds } from "../../prisma/seed-data";

export const getRandomCoordinatesWithinBounds = () => {
  const latLower = latBounds[0];
  const latUpper = latBounds[1];
  const longLower = longBounds[0];
  const longUpper = longBounds[1];
  return {
    lat: getRandomNumberInRange(latLower, latUpper, false),
    lng: getRandomNumberInRange(longLower, longUpper, false),
  };
};

export const getRandomValueWithinBounds = (
  bounds: number[],
  useFloor: boolean
): number => {
  return getRandomNumberInRange(bounds[0], bounds[1], useFloor);
};

function getRandomNumberInRange(min, max, useFloor = true) {
  if (useFloor) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return Math.random() * (max - min + 1) + min;
}

export function getRandomElementFromArr<T>(arr: T[], useFloor = true): T {
  return arr[getRandomNumberInRange(0, arr.length - 1, useFloor)];
}
