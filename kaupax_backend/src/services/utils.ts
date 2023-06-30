import axios from "axios";

export async function getReq({ url }: { url: string }) {
  const res = await axios.get(url);

  return {
    status: await res.status,
    res: await res.data,
  };
}
