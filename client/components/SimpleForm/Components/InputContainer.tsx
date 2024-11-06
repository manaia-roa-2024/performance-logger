import SimpleInput from "../Inputs/SimpleInput"
import InputLabel from "./InputLabel"
import cls from "../cls"
import InputProps from "../Inputs/InputProps"
import { ReactElement, ReactNode } from "react"
import React from "react"


export default function InputContainer<T extends SimpleInput<unknown>>( {finalProps, children}: {finalProps: InputProps<T>, children?: ReactNode}){
  return (
    <ConditionalWrapper wrap={!!finalProps.useContainer} containerElement={<div className={cls('sf-container', finalProps.containerClass)}/>}>
      <InputLabel label={finalProps.label} elementId={finalProps.elementId}/>
      <ConditionalWrapper wrap={!!finalProps.useInputBox} containerElement={<div className={cls('sf-input-box', finalProps.inputBoxClass)}/>}>
        {children}
      </ConditionalWrapper>
    </ConditionalWrapper>
  )
}

function ConditionalWrapper({wrap, children, containerElement}: {wrap: boolean, children?: ReactNode, containerElement: ReactElement}){
  return wrap ? React.cloneElement(containerElement, undefined, children) : <>{children}</>
}
/*
{/*<div className={cls('sf-container', finalProps.containerClass)}>
      <InputLabel label={finalProps.label} elementId={finalProps.elementId}/>
      <div className={cls('sf-input-box', finalProps.inputBoxClass)}>
        {children}
      </div>
    </div>*/