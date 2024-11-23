import SimpleInput from "./SimpleInput"
import InputProps from "./InputProps"
import { ChangeEvent } from "react"

export default class SimpleKeyboardInput extends SimpleInput<string>{
  maxlength: number | undefined
  placeholder: string | undefined
  size: string | undefined
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined
  onEnter: React.KeyboardEventHandler<HTMLInputElement> | undefined
  canInput: (newValue: string) => boolean 


  constructor(id: string, type: string){
    super(id, type)
    this.maxlength = undefined
    this.placeholder = undefined
    this.size = undefined
    this.onKeyDown = undefined
    this.onEnter = undefined

    this.value = ''
    this.canInput = () => true
  }

  updateValue(newValue: string): void {
    if (!this.canInput(newValue)) return

    this.value = newValue

    this.reload()
  }

  spreadInput(props: InputProps<SimpleKeyboardInput>): {[key: string]: unknown}{
    return {
      ...super.spreadInput(props),
      maxLength: props.maxlength,
      placeholder: props.placeholder,
      size: this.size,
      onChange: (e: ChangeEvent<HTMLInputElement>) => this.updateValue(e.target.value),
      onKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
        if (props.onEnter && e.key === 'Enter') props.onEnter(e)
        if (props.onKeyDown) props.onKeyDown(e)
      }
    }
  }
}