import { ReactNode } from "react";
import SimpleForm from "./SimpleForm";
import useSimpleForm from "./useSimpleForm";
import SimpleFormInstance from "./SimpleFormInstance";

export default function SimpleFormContainer<T extends object>(props: {children?: ReactNode, id: string, formBuilder: (form: SimpleForm<T>) => void}){
  useSimpleForm(props.id, props.formBuilder)
  return <SimpleFormInstance formId={props.id}>
    {props.children}
  </SimpleFormInstance>
}