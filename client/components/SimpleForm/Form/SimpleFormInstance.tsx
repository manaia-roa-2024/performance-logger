import useSimpleForm from "./useSimpleForm"
import SimpleForm from "./SimpleForm"
import React, {ReactNode} from "react"

interface Props{
  formId: string,
  children?: ReactNode
}

interface ISimpleFormInstanceContext{
  form: SimpleForm<object> | undefined,
  buildForm: (rerender?: boolean) => void
}

export const SimpleFormInstanceContext = React.createContext<ISimpleFormInstanceContext>({form: new SimpleForm<object>('not-implemented'), buildForm: () => {}})

export default function SimpleFormInstance({formId, children} : Props){
  const {form, buildForm} = useSimpleForm(formId)
  return <SimpleFormInstanceContext.Provider value={{form, buildForm}}>
    {children}
  </SimpleFormInstanceContext.Provider>
}