import React from "react";
import { SimpleFormContext } from "./SimpleFormProvider";
import SimpleForm from "./SimpleForm";
import useReload from "../hooks/useReload";

export default function useSimpleForm<T extends object>(id: string, callback?: (form: SimpleForm<T>) => void){
  const reload = useReload()
  const context = React.useContext(SimpleFormContext)!

  const buildForm = (rerender: boolean = false) =>{
    if (!callback) return

    const form = new SimpleForm<T>(id)
    form.reload = reload

    callback(form)

    context.addForm(form)

    if (rerender) reload()
  }

  if (!context.getForm(id)){
    if (!callback)
      throw new Error('Forms that do not exist are required to have a callback function. It is assumed there is a mistake where a non existent form is trying to be accessed.')

    buildForm()
  }
  
  return {form: context.getForm(id) as SimpleForm<T>, buildForm}
}