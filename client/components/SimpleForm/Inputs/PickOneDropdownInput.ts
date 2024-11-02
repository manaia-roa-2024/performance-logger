import { ReactNode } from "react";
import SimpleInput from "./SimpleInput";

export default class PickOneDropdownInput extends SimpleInput<number>{
  options: Array<string>
  defaultButtonText: string | undefined
  angleIcon: ReactNode | undefined
  
  constructor(id: string){
    super(id, 'pickonedropdown')
    
    this.defaultButtonText = undefined
    this.angleIcon = undefined

    this.options = []
  }
}