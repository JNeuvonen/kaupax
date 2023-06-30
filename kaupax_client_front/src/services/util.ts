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

export type QueryParams = Array<{ key: string; value: string }>;

export async function putReq({
  url,
  token,
  payload = {},
}: {
  url: string;
  token?: string;
  payload?: any;
}) {
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      authorization: token ? token : "",
    },
  });

  return {
    status: res.status,
    res: await res.json(),
  };
}

export async function postReq({
  url,
  token,
  payload = {},
  contentType = "application/json",
  queryParams = [],
}: {
  url: string;
  token?: string;
  payload?: any;
  contentType?: string;
  queryParams?: QueryParams;
}) {
  const urlWithQueryParams = url + buildQueryParams(queryParams);

  const res = await fetch(urlWithQueryParams, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": contentType,
      authorization: token ? token : "",
    },
  });

  return {
    status: res.status,
    res: await res.json(),
  };
}

export async function delReq({
  url,
  token,
  payload = {},
  contentType = "application/json",
  queryParams = [],
}: {
  url: string;
  token?: string;
  payload?: any;
  contentType?: string;
  queryParams?: QueryParams;
}) {
  const urlWithQueryParams = url + buildQueryParams(queryParams);

  const res = await fetch(urlWithQueryParams, {
    method: "DELETE",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": contentType,
      authorization: token ? token : "",
    },
  });

  return {
    status: res.status,
    res: await res.json(),
  };
}

export async function getReq({
  url,
  token,
  queryParams = [],
}: {
  url: string;
  token?: string;
  queryParams?: QueryParams;
}) {
  const urlWithQueryParams = url + buildQueryParams(queryParams);
  const res = await fetch(urlWithQueryParams, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? token : "",
    },
  });

  return {
    status: res.status,
    res: await res.json(),
  };
}
