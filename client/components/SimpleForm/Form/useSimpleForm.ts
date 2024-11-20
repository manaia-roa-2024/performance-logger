import React from "react";
import { SimpleFormContext } from "./SimpleFormProvider";
import SimpleForm, { FormBuilder } from "./SimpleForm";
import useReload from "../hooks/useReload";

export type BuildForm<T, V> = (variables?: V) => T

export default function useSimpleForm<T extends object, V=void>(id: string, callback: FormBuilder<T, V> | undefined, callbackVar?: V){
  const reload = useReload()
  const context = React.useContext(SimpleFormContext)!

  const buildForm: BuildForm<SimpleForm<T>, V> = (variables?: V) =>{
    const existingForm = context.forms.get(id)
    if (!callback && existingForm) return existingForm as SimpleForm<T>
    else if (!callback)
      throw new Error("Cannot call buildform for a form that does not exist")

    const form = new SimpleForm<T>(id)

    form.reload = context.getForm(id)?.reload ?? reload

    callback(form, variables!)

    context.addForm(form)

    return form
  }

  if (!context.getForm(id)){
    if (!callback)
      throw new Error('Forms that do not exist are required to have a callback function. It is assumed there is a mistake where a non existent form is trying to be accessed.')

    buildForm(callbackVar)
  }
  
  return {form: context.getForm(id) as SimpleForm<T>, buildForm}
}