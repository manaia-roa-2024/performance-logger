import { useQuery } from "@tanstack/react-query";
import getLogCollection from "../apis/getLogCollection";

export default function useLogCollection(){
  const query = useQuery({
    queryKey: ['log-collection'],
    queryFn: getLogCollection
  })

  return query
}