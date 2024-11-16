import { MutationFunction, QueryClient, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { ReactNode } from 'react'

interface MutationProps<T, V=void>{
  mutationFn: MutationFunction<T, V>,
  onSuccess?: (data: T, queryClient: QueryClient) => void,
  onSettled?: (data: T | undefined, queryClient: QueryClient) => void,
  children: (mutationResult: UseMutationResult<T, Error, V, unknown>) => ReactNode
}

export default function MutationComponent<T, V=void>(props: MutationProps<T, V>){
  const queryClient = useQueryClient()

  const mutation = useMutation<T, Error, V>({
    mutationFn: props.mutationFn,
    onSuccess: ((data: T) => props.onSuccess && props.onSuccess(data, queryClient)),
    onSettled: ((data: T | undefined) => props.onSettled && props.onSettled(data, queryClient))
  })

  return props.children(mutation)
}