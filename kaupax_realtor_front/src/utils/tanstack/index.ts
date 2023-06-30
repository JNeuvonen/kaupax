import { getReq } from "@/services/util";
import { useQuery } from "@tanstack/react-query";

export const useQueryKey = ({
  key,
  url,
  accessToken,
}: {
  key: string;
  url: string;
  accessToken?: string;
}) => {
  const fetchData = async () => {
    const res = await getReq({ url, token: accessToken });
    return res;
  };

  const query = useQuery({
    queryKey: [key],
    queryFn: fetchData,
    staleTime: Infinity,
  });

  return query;
};
