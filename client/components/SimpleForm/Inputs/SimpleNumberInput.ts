import SimpleKeyboardInput from "./SimpleKeyboardInput"
import InputProps from "./InputProps"
import cls from "../cls"

export class SimpleNumberInput extends SimpleKeyboardInput{
  min: number
  max: number
  validNumReg: RegExp // valid at submission time
  validInputReg: RegExp // determines if user is allowed to change input to inputted value. \
  //It is possible that a user is allowed to input something that at submission time is not valid such as '10.' or '-'

  constructor(id: string, type='number'){
    super(id, type)

    this.validNumReg = /^(-(?=.))?(0|[1-9]\d*)?(\.\d+)?$/ 
    this.validInputReg = /^-?(0|[1-9]\d*)?(\.\d*)?$/

    this.min = Number.MIN_SAFE_INTEGER
    this.max = Number.MAX_SAFE_INTEGER

    this.canInput = (newValue) => this.validInputReg.test(newValue) && !(newValue.startsWith('-') && this.min >= 0)
  }

  getFullInputClass(props: InputProps<SimpleNumberInput>){
    return cls('sf-keyboard-input sf-number-input', props.inputClass)
  }

  getFormattedValue(){
    return Number(this.value)
  }
}

export class SimpleIntegerInput extends SimpleNumberInput{
  constructor(id: string){
    super(id, 'integer')
    this.validNumReg = /^(-(?=.))?(0|[1-9]\d*)?$/
    this.validInputReg = /^-?(0|[1-9]\d*)?$/
  }

  getFullInputClass(props: InputProps<SimpleIntegerInput>){
    return cls('sf-keyboard-input sf-integer-input', props.inputClass)
  }
}

export class SimpleCurrencyInput extends SimpleNumberInput{
  symbol: string

  constructor(id: string){
    super(id, 'currency')

    this.symbol = '$'

    this.validNumReg = /^(-(?=.))?(0|[1-9]\d*)?(\.\d{1,2})?$/ 
    this.validInputReg = /^-?(0|[1-9]\d*)?(\.\d{0,2})?$/
  }

  getFullInputClass(props: InputProps<SimpleCurrencyInput>){
    return cls('sf-keyboard-input sf-currency-input', props.inputClass)
  }
}