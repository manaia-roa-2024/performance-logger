import { QueryFunction, useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactNode, useRef } from "react";

interface QueryProps<T>{
  queryKey: string[]
  queryFn: QueryFunction<T>
  children: (result: UseQueryResult<T>) => ReactNode
}

export default function QueryComponent<T=unknown>(props: QueryProps<T>) {
  const hasRunOnce = useRef(false)
  const query = useQuery<T>({queryKey: props.queryKey, queryFn: props.queryFn, enabled: !hasRunOnce.current, structuralSharing: false})
  hasRunOnce.current = true
  return props.children(query);
}