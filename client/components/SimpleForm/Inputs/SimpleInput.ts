import { FocusEventHandler, MouseEventHandler } from "react"
import SimpleForm from "../Form/SimpleForm"
import getRandomHtmlId from "../GetRandomString"
import '../simpleform.css'
import InputProps from "./InputProps"

/* GAMEPLAN */
/*
 - Improve upon existing form provider
 
 GOALS
 - Isolate inputs from their parent form
 - Separate component for each type of input
 - Give input list of dependent inputs for validation to avoid revalidating all inputs after value changed.
 - Give input components props that take precedence over input object properties
 - Simplify form context provider
 - Configure validation types for each input (Always, after input, after submit ect, never)
 - new method getDtoValue for value that goes into form dto object
 - make it easier to assign input class

 TODO
 - 
*/

const RANDOMIDFN = getRandomHtmlId

export default class SimpleInput<T>{
  [key: string]: unknown

  #reload: (() => void) | undefined

  readonly id: string
  readonly type: string
  elementId: string
  required: boolean

  value: T | undefined

  containerClass: string | undefined
  inputBoxClass: string | undefined

  useContainer: boolean
  useInputBox: boolean

  inputClass: string | undefined
  label: string | undefined
  dtoName: string | undefined
  
  name: string | undefined
  readonly: boolean
  title: string | undefined
  form: SimpleForm<object> | undefined

  onClick: MouseEventHandler | undefined
  onBlur: FocusEventHandler | undefined

  constructor(id: string, type: string){
    this.inputClassBase = ''
    this.inputClass = undefined
    this.label = undefined
    this.containerClass = undefined
    this.value = undefined
    this.name = undefined
    this.title = undefined
    this.inputBoxClass = undefined
    this.dtoName = undefined
    this.form = undefined
    this.onClick = undefined
    this.onBlur = undefined

    this.#reload = undefined

    this.id = id
    this.type = type
    this.elementId = RANDOMIDFN()
    this.required = false
    this.readonly = false
    this.useContainer = true
    this.useInputBox = true
  }

  updateValue(newValue: T){
    this.value = newValue
    this.reload()
  }

  getFormattedValue(): unknown{
    return this.value
  }

  getDtoValue(){
    return this.getFormattedValue()
  }

  getFullInputClass(props: InputProps<SimpleInput<unknown>>){
    return props.inputClass
  }

  spreadInput(props: InputProps<SimpleInput<unknown>>): {[key: string]: unknown}{
    return {
      id: props.elementId,
      className: this.getFullInputClass(props),
      value: props.value,
      name: props.name,
      readOnly: props.readonly,
      title: props.title,
      onClick: props.onClick,
      onBlur: props.onBlur
    }
  }

  reload(){
    if (this.#reload){
      this.#reload()
    }
  }

  setReload(func: () => void){
    this.#reload = func
  }

  hasReload(){
    return this.#reload != undefined
  }

}