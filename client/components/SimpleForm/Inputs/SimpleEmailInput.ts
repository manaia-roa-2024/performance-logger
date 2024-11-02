import SimpleKeyboardInput from "./SimpleKeyboardInput";
import InputProps from "./InputProps";
import SimpleInput from "./SimpleInput";
import cls from "../cls";

export default class SimpleEmailInput extends SimpleKeyboardInput{
  constructor(id: string){
    super(id, 'email')
  }

  getFullInputClass(props: InputProps<SimpleInput<unknown>>){
    return cls('sf-keyboard-input sf-email-input', props.inputClass)
  }
}