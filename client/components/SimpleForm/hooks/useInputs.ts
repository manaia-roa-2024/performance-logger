import { useMemo, useState } from "react"
import useReload from "./useReload"
import SimpleInput from "../Inputs/SimpleInput"
import SimpleTextInput from "../Inputs/SimpleTextInput"
import SimplePasswordInput from "../Inputs/SimplePasswordInput"
import SimpleTextAreaInput from "../Inputs/SimpleTextAreaInput"
import { SimpleNumberInput, SimpleIntegerInput, SimpleCurrencyInput } from "../Inputs/SimpleNumberInput"
import SimpleEmailInput from "../Inputs/SimpleEmailInput"
import SimpleCheckboxInput from "../Inputs/SimpleCheckboxInput"
import SimpleDateInput from "../Inputs/SimpleDateInput"
import PickOneDropdownInput from "../Inputs/PickOneDropdownInput"

type Callback<T> = (inp: T) => void

export function useSimpleInput<T extends SimpleInput<unknown>>(id: string, c: new (id: string) => T, callback?: Callback<T>){
  const inputState = useState<T>(new c(id))
  const reload = useReload()

  const input = inputState[0]

  useMemo(() =>{
    input.reload = reload

    if (typeof(callback) === 'function')
      callback(input)
  }, [])
  
  return input
}

export function useTextInput(id: string, callback?: Callback<SimpleTextInput>){
  return useSimpleInput<SimpleTextInput>(id, SimpleTextInput, callback)
}

export function usePasswordInput(id: string, callback?: Callback<SimplePasswordInput>){
  return useSimpleInput<SimplePasswordInput>(id, SimplePasswordInput, callback)
}

export function useTextAreaInput(id: string, callback?: Callback<SimpleTextAreaInput>){
  return useSimpleInput<SimpleTextAreaInput>(id, SimpleTextAreaInput, callback)
}

export function useNumberInput(id: string, callback?: Callback<SimpleNumberInput>){
  return useSimpleInput<SimpleNumberInput>(id, SimpleNumberInput, callback)
}

export function useIntegerInput(id: string, callback?: Callback<SimpleIntegerInput>){
  return useSimpleInput<SimpleIntegerInput>(id, SimpleIntegerInput, callback)
}

export function useCurrencyInput(id: string, callback?: Callback<SimpleCurrencyInput>){
  return useSimpleInput<SimpleCurrencyInput>(id, SimpleCurrencyInput, callback)
}

export function useEmailInput(id: string, callback?: Callback<SimpleEmailInput>){
  return useSimpleInput<SimpleEmailInput>(id, SimpleEmailInput, callback)
}

export function useCheckboxInput(id: string, callback?: Callback<SimpleCheckboxInput>){
  return useSimpleInput<SimpleCheckboxInput>(id, SimpleCheckboxInput, callback)
}

export function useDateInput(id: string, callback?: Callback<SimpleDateInput>){
  return useSimpleInput<SimpleDateInput>(id, SimpleDateInput, callback)
}

export function usePickOneDropdownInput(id: string, callback?: Callback<PickOneDropdownInput>){
  return useSimpleInput<PickOneDropdownInput>(id, PickOneDropdownInput, callback)
}
