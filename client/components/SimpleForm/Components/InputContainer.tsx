import SimpleInput from "../Inputs/SimpleInput"
import InputLabel from "./InputLabel"
import cls from "../cls"
import InputProps from "../Inputs/InputProps"
import { ReactNode } from "react"

export default function InputContainer<T extends SimpleInput<unknown>>( {finalProps, children}: {finalProps: InputProps<T>, children?: ReactNode}){
  return <div className={cls('sf-container', finalProps.containerClass)}>
    <InputLabel label={finalProps.label} elementId={finalProps.elementId}/>
    <div className={cls('sf-input-box', finalProps.inputBoxClass)}>
      {children}
    </div>
  </div>
}