import { ChangeEvent } from "react";
import cls from "../cls";
import InputProps from "./InputProps";
import SimpleInput from "./SimpleInput";

export default class SimpleDateInput extends SimpleInput<string>{
  min: string | undefined
  max: string | undefined
  step: number | 'any' | undefined

  constructor(id: string){
    super(id, 'date')

    this.min = undefined
    this.max = undefined
    this.step = undefined

    this.value = this.toISODate(new Date())
  }

  spreadInput(props: InputProps<SimpleDateInput>): { [key: string]: unknown; } {
    return {
      ...super.spreadInput(props),
      min: props.min,
      max: props.max,
      step: props.step,
      onChange: (e: ChangeEvent<HTMLInputElement>) => this.updateValue(e.target.value)
    }
  }

  toISODate(date: Date): string{
    return this.getLocalDate(date).toISOString().substring(0, 10)
  }

  getLocalDate = (date?: Date) =>{
    const utc = date == null ? new Date() : date
    return new Date(utc.getTime() - (utc.getTimezoneOffset() * 60000))
  }

  getFullInputClass(props: InputProps<SimpleDateInput>){
    return cls('sf-date-input', props.inputClass)
  }

  asDate(): Date{

    return new Date(this.value!)
  }
}