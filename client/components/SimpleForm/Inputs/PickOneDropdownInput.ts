import { ReactNode } from "react";
import SimpleInput from "./SimpleInput";
import { DropdownOptions } from "../Components/Dropdown/DropdownTypes";

export default class PickOneDropdownInput<K=string> extends SimpleInput<number>{
  options: DropdownOptions<K>
  defaultButtonText: string | undefined
  angleIcon: ReactNode | undefined
  
  constructor(id: string){
    super(id, 'pickonedropdown')
    
    this.defaultButtonText = undefined
    this.angleIcon = undefined

    this.options = []
  }

  getSelectedOption(){
    return this.value == null ? undefined : this.options[this.value]
  }

  getSelectedKey(){
    return this.getSelectedOption()?.key
  }

  getSelectedValue(){
    return this.getSelectedOption()?.value
  }
}