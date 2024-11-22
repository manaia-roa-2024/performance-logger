import React, { ReactNode, useState } from "react"
import SimpleForm from "./SimpleForm"
import { BuildForm } from "./useSimpleForm"

export const SimpleFormContext = React.createContext<SFContext>({} as unknown as SFContext)

interface Props{
  children?: ReactNode
}

export type FormTuple<T extends object, V> = {
  form: SimpleForm<T>,
  buildForm: BuildForm<T, V>
}

export interface SFContext{
  forms: Map<string, FormTuple<object, unknown>>,
  addForm: (tuple: FormTuple<object, unknown>) => void,
  removeForm: (id: string) => boolean,
  getForm: (id: string) => SimpleForm<object> | undefined,
  getBuilder: (id: string) => BuildForm<SimpleForm<object>, unknown>
}

export function SimpleFormProvider({children} : Props){

  const [value] = useState<SFContext>(() =>{

    const forms = new Map<string, FormTuple<object, unknown>>()

    const addForm = (tuple: FormTuple<object, unknown>) =>{
      forms.set(tuple.form.id, tuple)
    }

    const removeForm = (id: string) => forms.delete(id)

    const getForm = (id: string) => forms.get(id)?.form

    const getBuilder = (id: string) => forms.get(id)?.buildForm

    return {forms, addForm, removeForm, getForm, getBuilder} as SFContext
  })

  return <SimpleFormContext.Provider value={value}>
    {children}
  </SimpleFormContext.Provider>
}