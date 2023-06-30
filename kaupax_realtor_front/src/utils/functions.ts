import { AuthContext } from "@/context/auth";
import { postReq } from "@/services/util";
import { useToastPropsTypes } from "./hooks/useToastProps";
import { Apartment, ApartmentMapBoxFmt } from "./types/apartment";

export const getApartmentWithMapboxLayerFmt = (
  apartments: Apartment[]
): any => {
  const features = apartments.map((apartment: Apartment) => {
    const { lat, lng } = apartment;

    const obj = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: {
        cluster: false,
        ...apartment,
      },
    };

    return obj;
  });

  return {
    type: "FeatureCollection",
    features: features,
  };
};

export const calculateDuration = ({
  startZoom,
  targetZoom,
}: {
  startZoom: number;
  targetZoom: number;
}) => {
  const diff = Math.abs(startZoom - targetZoom);
  const ret = diff * 100;
  return ret;
};

export type QueryParams = Array<{ key: string; value: string }>;
export const buildQueryParams = (queryParams: QueryParams) => {
  if (queryParams.length === 0) return "";
  let ret = "?";
  queryParams.forEach((param, i) => {
    if (i === queryParams.length - 1) {
      ret += `${param.key}=${param.value}`;
    } else {
      ret += `${param.key}=${param.value}&`;
    }
  });
  return ret;
};

export const singleUploadFile = async (files: FileList, auth: AuthContext) => {
  try {
    const formData = new FormData();
    formData.append("file", files[0]);
    const data = await fetch(
      "/api/aws/file-upload" +
        buildQueryParams([
          {
            key: "usersEmail",
            value: auth.user?.email as string,
          },
        ]),
      {
        method: "POST",
        body: formData,
        headers: {
          authorization: auth.accessToken as string,
        },
      }
    );

    return await data.json();
  } catch (err) {
    return null;
  }
};

export const bulkUploadFiles = (
  files: FileList,
  toastProps: useToastPropsTypes,
  auth: AuthContext,
  url: string,
  callback?: () => void
) => {
  const arrOfUrls = [] as string[];

  Array.from(files).forEach(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    fetch(
      "/api/aws/file-upload" +
        buildQueryParams([
          {
            key: "usersEmail",
            value: auth.user?.email as string,
          },
        ]),
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        arrOfUrls.push(data.message);

        if (arrOfUrls.length === files.length) {
          postReq({
            token: auth.accessToken as string,
            url: url,
            payload: {
              arrOfUrls: arrOfUrls,
            },
          }).then((data) => {
            if (data.status === 200) {
              toastProps.openToast({
                message: `Kuvat lisättiin ilmoitukseen`,
                severity: "success",
              });

              if (callback !== undefined) {
                callback();
              }
            }
          });
        }
      });
  });
};

export const calculateClusterPricePerSqm = ({
  items,
}: {
  items: ApartmentMapBoxFmt[];
}) => {
  let ret = 0;
  items.forEach((item) => {
    ret += item.properties.usersEstimateOfPrice
      ? item.properties.usersEstimateOfPrice / item.properties.surfaceArea
      : 0;
  });
  return ret / items.length;
};

export const formatPrices = (price: number) => {
  if (price > 1000000) {
    return (price / 1000000).toFixed(2) + "m";
  }

  if (price > 100000) {
    const priceFmt = (price / 1000).toFixed(1).split(".");

    if (priceFmt[1][0] === "0") {
      //remove trailing zero if unnecessary
      return priceFmt[0] + "k";
    }

    return (price / 1000).toFixed(1) + "k";
  }
  return price;
};

export const linearlyScaleColorBasedOnValue = ({
  lowerBound,
  upperBound,
  startColor,
  endColor,
  value,
}: {
  lowerBound: number;
  upperBound: number;
  startColor: {
    r: number;
    g: number;
    b: number;
  };
  endColor: {
    r: number;
    g: number;
    b: number;
  };
  value: number;
}) => {
  if (value <= lowerBound) return startColor;
  if (value >= upperBound) return endColor;

  const scale = (value - lowerBound) / (upperBound - lowerBound);

  return {
    r: Math.floor(startColor.r + scale * (endColor.r - startColor.r)),
    g: Math.floor(startColor.g + scale * (endColor.g - startColor.g)),
    b: Math.floor(startColor.b + scale * (endColor.b - startColor.b)),
  };
};

export const getTimeElapsed = (date: Date) => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime());
  const diffInDays = Math.floor(diff / (1000 * 3600 * 24));
  const diffInHours = Math.floor(diff / (1000 * 3600));
  const diffInMinutes = Math.floor(diff / (1000 * 60));

  if (diffInDays > 7) {
    return diffInDays + "d sitten";
  }

  if (diffInHours > 0) {
    return diffInHours + "h sitten";
  }

  if (diffInMinutes > 0) {
    return diffInMinutes + "m sitten";
  }

  return "Juuri lisätty";
};

export const getPluralOrSingular = (
  num: number,
  singular: string,
  plural: string
) => {
  if (num === 1) {
    return singular;
  }

  return plural;
};

export const convertFormattedDateToTimeElapsed = (date: string) => {
  const unitsInMs = {
    "d sitten": 1000 * 60 * 60 * 24,
    "h sitten": 1000 * 60 * 60,
    "m sitten": 1000 * 60,
    "Juuri lisätty": 0,
  };

  if (date.includes("d sitten")) {
    return Number(date.replace("d sitten", "")) * unitsInMs["d sitten"];
  }

  if (date.includes("h sitten")) {
    return Number(date.replace("h sitten", "")) * unitsInMs["h sitten"];
  }

  if (date.includes("m sitten")) {
    return Number(date.replace("m sitten", "")) * unitsInMs["m sitten"];
  }

  if (date.includes("Juuri lisätty")) {
    return 0;
  }

  return 0;
};

export const convertFormattedPriceToNumber = (price: string) => {
  if (price.includes("m")) {
    return parseFloat(price) * 1000000;
  }

  if (price.includes("k")) {
    return parseFloat(price) * 1000;
  }

  return parseFloat(price);
};
