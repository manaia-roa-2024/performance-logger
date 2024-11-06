import useSimpleForm from "./useSimpleForm"
import SimpleForm from "./SimpleForm"
import React, {ReactNode} from "react"

interface Props{
  formId: string,
  children?: ReactNode
}

export const SimpleFormInstanceContext = React.createContext<{form: SimpleForm<object>} | undefined>(undefined)

export default function SimpleFormInstance({formId, children} : Props){
  const {form} = useSimpleForm(formId)
  return <SimpleFormInstanceContext.Provider value={{form}}>
    {children}
  </SimpleFormInstanceContext.Provider>
}