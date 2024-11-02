import React, { ReactNode, useState } from "react"
import SimpleForm from "./SimpleForm"

export const SimpleFormContext = React.createContext<SFContext | undefined>(undefined)

interface Props{
  children?: ReactNode
}

export interface SFContext{
  forms: Map<string, SimpleForm<object>>,
  addForm: (form: SimpleForm<object>) => void,
  removeForm: (id: string) => boolean,
  getForm: (id: string) => SimpleForm<object> | undefined
}

export function SimpleFormProvider({children} : Props){

  const [value, setValue] = useState<SFContext>(() =>{

    const forms = new Map<string, SimpleForm<object>>()

    const addForm = (form: SimpleForm<object>) =>{
      forms.set(form.id, form)
    }

    const removeForm = (id: string) => forms.delete(id)

    const getForm = (id: string) => forms.get(id)

    return {forms, addForm, removeForm, getForm} as SFContext
  })

  return <SimpleFormContext.Provider value={value}>
    {children}
  </SimpleFormContext.Provider>
}