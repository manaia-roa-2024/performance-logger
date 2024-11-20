import cls from "../cls";
import InputProps from "./InputProps";
import SimpleKeyboardInput from "./SimpleKeyboardInput";

export default class SimpleTimeInput extends SimpleKeyboardInput{
  validTimeReg: RegExp // valid time at submission
  validInputReg: RegExp // determines if user is allowed to change input to inputted value.

  constructor(id: string){
    super(id, 'time')

    this.validTimeReg = /(^\d+:\d+:\d+$)|(^\d+:\d+$)|(^\d+$)/
    this.validInputReg = /(^\d*$)|(^\d*(:\d*)?$)|(^\d*:\d*(:\d*)?$)/
  }

  updateValue(newValue: string): void {
    if (!this.validInputReg.test(newValue))
      return

    this.value = newValue

    this.reload()
  }

  getFullInputClass(props: InputProps<SimpleTimeInput>){
    return cls('sf-keyboard-input sf-time-input', props.inputClass)
  }
}