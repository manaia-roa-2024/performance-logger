import cls from "../cls";
import SimpleKeyboardInput from "./SimpleKeyboardInput";
import InputProps from "./InputProps";
import { ReactNode } from "react";

export default class SimplePasswordInput extends SimpleKeyboardInput{
  showPassword: boolean
  enableToggler: boolean
  toggleOnElement: ReactNode
  toggleOffElement: ReactNode

  constructor(id: string){
    super(id, 'password')

    this.toggleOnElement = undefined
    this.toggleOffElement = undefined

    this.showPassword = false
    this.enableToggler = true
  }

  getFullInputClass(props: InputProps<SimplePasswordInput>){
    const eyeVisClass = props.enableToggler && 'sf-eye-visible'
    const showPasswordClass = props.showPassword && 'sf-show-password'

    return cls('sf-keyboard-input sf-password-input', props.inputClass, eyeVisClass, showPasswordClass)
  }

}