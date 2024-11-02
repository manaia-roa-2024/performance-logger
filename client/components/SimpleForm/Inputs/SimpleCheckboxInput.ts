import SimpleInput from "./SimpleInput";
import InputProps from "./InputProps";
import cls from "../cls";
import { ReactNode } from "react";

export default class SimpleCheckboxInput extends SimpleInput<boolean>{
  checkElement: ReactNode | undefined

  constructor(id: string){
    super(id, 'checkbox')
    this.value = false
    this.checkElement = undefined
  }

  spreadInput(props: InputProps<SimpleCheckboxInput>): {[key: string]: unknown}{
    return {
      id: props.elementId,
      className: this.getFullInputClass(props),
      title: props.title
    }
  }

  getFullInputClass(props: InputProps<SimpleCheckboxInput>){
    return cls('sf-checkbox-input', props.inputClass) 
  }
}