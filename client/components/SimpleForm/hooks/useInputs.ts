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
import SimpleTimeInput from "../Inputs/SimpleTimeInput"

type Callback<T> = (inp: T) => void

interface SimpleOptions{
  reloadType?: 'internal' | 'external'
}

export function useSimpleInput<T extends SimpleInput<unknown>>(id: string, c: new (id: string) => T, callback?: Callback<T>, simpleOptions: SimpleOptions = {
  reloadType: 'internal'
}){
  const inputState = useState<T>(new c(id))
  const reload = useReload()

  const input = inputState[0]

  useMemo(() =>{
    if (simpleOptions.reloadType === 'external')
      input.setReload(reload)

    if (typeof(callback) === 'function')
      callback(input)
  }, [])
  
  return input
}

export function useTextInput(id: string, callback?: Callback<SimpleTextInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleTextInput>(id, SimpleTextInput, callback, simpleOptions)
}

export function usePasswordInput(id: string, callback?: Callback<SimplePasswordInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimplePasswordInput>(id, SimplePasswordInput, callback, simpleOptions)
}

export function useTextAreaInput(id: string, callback?: Callback<SimpleTextAreaInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleTextAreaInput>(id, SimpleTextAreaInput, callback, simpleOptions)
}

export function useNumberInput(id: string, callback?: Callback<SimpleNumberInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleNumberInput>(id, SimpleNumberInput, callback, simpleOptions)
}

export function useIntegerInput(id: string, callback?: Callback<SimpleIntegerInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleIntegerInput>(id, SimpleIntegerInput, callback, simpleOptions)
}

export function useCurrencyInput(id: string, callback?: Callback<SimpleCurrencyInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleCurrencyInput>(id, SimpleCurrencyInput, callback, simpleOptions)
}

export function useEmailInput(id: string, callback?: Callback<SimpleEmailInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleEmailInput>(id, SimpleEmailInput, callback, simpleOptions)
}

export function useCheckboxInput(id: string, callback?: Callback<SimpleCheckboxInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleCheckboxInput>(id, SimpleCheckboxInput, callback, simpleOptions)
}

export function useDateInput(id: string, callback?: Callback<SimpleDateInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleDateInput>(id, SimpleDateInput, callback, simpleOptions)
}

export function usePickOneDropdownInput(id: string, callback?: Callback<PickOneDropdownInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<PickOneDropdownInput>(id, PickOneDropdownInput, callback, simpleOptions)
}

export function useTimeInput(id: string, callback: Callback<SimpleTimeInput>, simpleOptions?: SimpleOptions){
  return useSimpleInput<SimpleTimeInput>(id, SimpleTimeInput, callback, simpleOptions)
}
