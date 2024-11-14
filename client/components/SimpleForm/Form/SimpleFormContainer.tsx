import { ReactNode } from "react";
import SimpleForm, { FormBuilder } from "./SimpleForm";
import useSimpleForm from "./useSimpleForm";
import SimpleFormInstance from "./SimpleFormInstance";

export default function SimpleFormContainer<T extends object>(props: {children: (form: SimpleForm<T>, buildForm: (rerender?: boolean) => void) => ReactNode, id: string, formBuilder: FormBuilder<T>}){
  const sf = useSimpleForm(props.id, props.formBuilder)
  return <SimpleFormInstance formId={props.id}>
    {props.children(sf.form, sf.buildForm)}
  </SimpleFormInstance>
}
interface ConsumerProps<T extends object>{
  id: string,
  formBuilder: FormBuilder<T>,
  children: (form: SimpleForm<T>, buildForm: (rerender?: boolean) => void) => ReactNode
}

export function SimpleFormConsumer<T extends object>(props: ConsumerProps<T>){
  const {form, buildForm} = useSimpleForm(props.id, props.formBuilder)
  return props.children(form, buildForm)
}