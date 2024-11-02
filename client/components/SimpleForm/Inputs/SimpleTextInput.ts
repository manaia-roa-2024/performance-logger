import formatText from "../formatText"
import SimpleKeyboardInput from "./SimpleKeyboardInput"
import InputProps from "./InputProps"
import SimpleInput from "./SimpleInput"
import cls from "../cls"

export default class SimpleTextInput extends SimpleKeyboardInput{
  spellcheck: boolean | undefined
  
  constructor(id: string){
    super(id, 'text')
    this.spellcheck = undefined
  }

  getFormattedValue(){
    return this.value ? formatText(this.value) : ''
  }

  spreadInput(props: InputProps<SimpleTextInput>): {[key: string]: unknown}{
    return {
      ...super.spreadInput(props),
      spellCheck: props.spellcheck
    }
  }

  getFullInputClass(props: InputProps<SimpleInput<unknown>>){
    return cls('sf-keyboard-input sf-text-input', props.inputClass)
  }
}