import SimpleInput from "../Inputs/SimpleInput"

type BaseInput = SimpleInput<unknown>

export type FormBuilder = (form: SimpleForm<Record<string, unknown>>) => void

export default class SimpleForm<T extends object>{
  id: string
  #inputs: Map<string, BaseInput>
  reload: () => void

  constructor(id: string){
    this.id = id
    this.#inputs = new Map<string, BaseInput>()
    this.reload = () => {}
  }

  addInput(input: BaseInput){
    this.#inputs.set(input.id, input)
    input.setReload(this.reload)
    input.form = this
  }
  
  addInputs(...inputs: BaseInput[]){
    for (const input of inputs){
      this.addInput(input)
    }
  }

  getInput(id: string){
    return this.#inputs.get(id)
  }

  removeInput(id: string){
    return this.#inputs.delete(id)
  }

  createDto(): T{
    const obj: Record<string, unknown> = {}
    this.#inputs.forEach((input) =>{
      if (input.dtoName == null) return
      obj[input.dtoName] = input.getDtoValue()
    })
    return obj as T
  }
} 