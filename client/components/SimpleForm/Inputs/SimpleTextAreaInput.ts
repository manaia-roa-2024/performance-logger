import SimpleKeyboardInput from "./SimpleKeyboardInput";
import InputProps from "./InputProps";
import SimpleInput from "./SimpleInput";
import cls from "../cls";

export default class SimpleTextAreaInput extends SimpleKeyboardInput{
  autocapitalize: string | undefined
  autocorrect: string | undefined
  autofocus: boolean | undefined
  cols: number | undefined
  rows: number | undefined
  spellcheck: boolean | undefined
  wrap: string | undefined

  constructor(id: string){
    super(id, 'textarea')
    this.autocapitalize = undefined
    this.autocorrect = undefined
    this.cols = undefined
    this.row = undefined
    this.spellcheck = undefined
    this.wrap = undefined
  }

  spreadInput(props: InputProps<SimpleTextAreaInput>): {[key: string]: unknown}{
    return {
      ...super.spreadInput(props),
      autoCapitalize: props.autocapitalize,
      autoCorrect: props.autocorrect,
      autoFocus: props.autofocus,
      cols: props.cols,
      rows: props.cols,
      spellCheck: props.spellcheck,
      wrap: props.wrap
    }
  }

  getFullInputClass(props: InputProps<SimpleInput<unknown>>){
    return cls('sf-keyboard-input sf-textarea-input', props.inputClass)
  }
}