import { AuthContext } from "@/context/auth";
import { buildQueryParams, postReq } from "@/services/util";
import { useToastPropsTypes } from "./hooks/useToastManager";
import { Listing, ListingMapBoxFmt } from "./types/listing";

export function getNameFmt({
  firstName,
  surname,
}: {
  firstName: string;
  surname: string;
}) {
  if (firstName && surname) {
    return `${firstName.substring(0, 1)}${surname.substring(0, 1)}`;
  }

  return null;
}

export function buildClassNames(arrOfItems: string[]) {
  if (arrOfItems.length === 0) {
    return "";
  }

  let ret = "";
  arrOfItems.forEach((item) => {
    ret += item + " ";
  });

  return ret.substring(0, ret.length - 1);
}

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

export const getTimeElapsed = (date: Date) => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime());
  const diffInDays = Math.floor(diff / (1000 * 3600 * 24));
  const diffInHours = Math.floor(diff / (1000 * 3600));
  const diffInMinutes = Math.floor(diff / (1000 * 60));

  if (diffInDays > 7) {
    return diffInDays + " päivää sitten";
  }

  if (diffInHours > 0) {
    return diffInHours + " tuntia sitten";
  }

  if (diffInMinutes > 0) {
    return diffInMinutes + " minuuttia sitten";
  }

  return "Juuri lisätty";
};

export const convertFormattedDateToTimeElapsed = (date: string) => {
  const unitsInMs = {
    "d sitten": 1000 * 60 * 60 * 24,
    "h sitten": 1000 * 60 * 60,
    "m sitten": 1000 * 60,
    "Juuri lisätty": 0,
  };

  if (date.includes(" päivää sitten")) {
    return Number(date.replace(" päivää sitten", "")) * unitsInMs["d sitten"];
  }

  if (date.includes(" tuntia sitten")) {
    return Number(date.replace(" tuntia sitten", "")) * unitsInMs["h sitten"];
  }

  if (date.includes(" minuuttia sitten")) {
    return (
      Number(date.replace(" minuuttia sitten", "")) * unitsInMs["m sitten"]
    );
  }

  if (date.includes("Juuri lisätty")) {
    return 0;
  }

  return 0;
};

export const bulkUploadFiles = (
  files: FileList,
  toastProps: useToastPropsTypes,
  auth: AuthContext,
  url: string,
  accessToken: string,
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
        headers: {
          authorization: accessToken,
        },
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

export const getApartmentWithMapboxLayerFmt = (apartments: Listing[]): any => {
  const features = apartments.map((apartment: Listing) => {
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

export const calculateClusterPricePerSqm = ({
  items,
}: {
  items: ListingMapBoxFmt[];
}) => {
  let ret = 0;
  items.forEach((item) => {
    ret += item.properties.usersEstimateOfPrice
      ? item.properties.usersEstimateOfPrice / item.properties.surfaceArea
      : 0;
  });
  return ret / items.length;
};

export const formatPrice = (price: string) => {
  let ret = "";
  for (let i = price.length - 1, counter = 0; i >= 0; i--, counter++) {
    const char = price[i];
    ret += char;
    if ((counter + 1) % 3 === 0 && i !== 0) {
      ret += " ";
    }
  }
  return ret.split("").reverse().join("");
};
