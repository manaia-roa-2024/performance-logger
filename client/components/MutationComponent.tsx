import { MutationFunction, QueryClient, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { ReactNode } from 'react'

interface MutationProps<T>{
  mutationFn: MutationFunction<T>,
  onSuccess: (data: T, queryClient: QueryClient) => void,
  children: (mutationResult: UseMutationResult<T, Error, void, unknown>) => ReactNode
}

export default function MutationComponent<T>(props: MutationProps<T>){
  const queryClient = useQueryClient()

  const mutation = useMutation<T>({
    mutationFn: props.mutationFn,
    onSuccess: (data: T) => props.onSuccess(data, queryClient),
  })

  return props.children(mutation)
}