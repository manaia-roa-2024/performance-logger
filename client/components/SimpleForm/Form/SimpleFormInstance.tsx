import useSimpleForm, { BuildForm } from "./useSimpleForm"
import SimpleForm from "./SimpleForm"
import React, {ReactNode} from "react"

interface Props{
  formId: string,
  children?: ReactNode
}

export interface ISimpleFormInstanceContext<T, V>{
  form: SimpleForm<object>,
  buildForm: BuildForm<T, V>
}

export const SimpleFormInstanceContext = React.createContext<ISimpleFormInstanceContext<SimpleForm<object>, unknown>>({} as unknown as ISimpleFormInstanceContext<SimpleForm<object>, unknown>)

export default function SimpleFormInstance({formId, children} : Props){
  const {form, buildForm} = useSimpleForm<object, unknown>(formId)
  return <SimpleFormInstanceContext.Provider value={{form, buildForm}}>
    {children}
  </SimpleFormInstanceContext.Provider>
}