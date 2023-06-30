import { getReq } from "@/services/util";
import { useQuery } from "@tanstack/react-query";

export const useQueryKey = ({
  key,
  url,
  accessToken,
  staleTime = Infinity,
}: {
  key: string;
  url: string;
  accessToken?: string;
  staleTime?: number;
}) => {
  const fetchData = async () => {
    const res = await getReq({ url, token: accessToken });
    return res;
  };

  const query = useQuery({
    queryKey: [key],
    queryFn: fetchData,
    staleTime: staleTime,
  });

  return query;
};
