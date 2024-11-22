import { ReactNode } from "react";
import SimpleForm, { FormBuilder } from "./SimpleForm";
import useSimpleForm, { BuildForm } from "./useSimpleForm";
import SimpleFormInstance from "./SimpleFormInstance";


export default function SimpleFormContainer<T extends object, V=void>(props: {children: (form: SimpleForm<T>, buildForm: BuildForm<SimpleForm<T>, V>) => ReactNode, id: string, formBuilder: FormBuilder<T, V>, variables?: V}){
  const sf = useSimpleForm(props.id, props.formBuilder, props.variables)
  return <SimpleFormInstance formId={props.id}>
    {props.children(sf.form, sf.buildForm)}
  </SimpleFormInstance>
}

