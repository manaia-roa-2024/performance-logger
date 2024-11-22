import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

interface Props{
  children: (queryClient: QueryClient) => ReactNode
}

export default function QCC(props: Props){
  const queryClient = useQueryClient()

  return props.children(queryClient)
}