import SimpleInput from "./SimpleInput"
import InputProps from "./InputProps"
import { ChangeEvent } from "react"

export default class SimpleKeyboardInput extends SimpleInput<string>{
  maxlength: number | undefined
  placeholder: string | undefined

  constructor(id: string, type: string){
    super(id, type)
    this.maxlength = undefined
    this.placeholder = undefined
    this.value = ''
  }

  spreadInput(props: InputProps<SimpleKeyboardInput>): {[key: string]: unknown}{
    return {
      ...super.spreadInput(props),
      maxLength: props.maxlength,
      placeholder: props.placeholder,
      onChange: (e: ChangeEvent<HTMLInputElement>) => this.updateValue(e.target.value)
    }
  }
}