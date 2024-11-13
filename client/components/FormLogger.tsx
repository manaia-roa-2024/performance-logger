import { useContext } from "react";
import { SimpleFormContext } from "./SimpleForm/Form/SimpleFormProvider";

export default function FormLogger(){
  const forms = useContext(SimpleFormContext)
  console.log(forms?.forms)
  return <div></div>
}