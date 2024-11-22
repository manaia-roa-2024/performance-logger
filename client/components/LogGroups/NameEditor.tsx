import { Component, ReactNode, KeyboardEvent } from "react";
import CTextInput from "../SimpleForm/Components/CTextInput";
import { SimpleFormInstanceContext } from "../SimpleForm/Form/SimpleFormInstance";
import LogGroup, { ILogGroup } from "../../../models/classes/LogGroup";
import MutationComponent from "../MutationComponent";
import editLogGroup from "../../apis/editLogGroup";
import SimpleTextInput from "../SimpleForm/Inputs/SimpleTextInput";
import { LogGroupContext } from "./LGContext";

interface Props{
  onBlur: () => void,
  logGroup: LogGroup
}

export default class NameEditor extends Component<Props>{
  static contextType = SimpleFormInstanceContext

  context!: React.ContextType<typeof SimpleFormInstanceContext>

  constructor(props: Props){
      super(props)
  }

  getNameInput(){
    return this.context.form.getInput('name')! as SimpleTextInput
  }

  componentDidMount(): void {
    const inputElement = document.getElementById(this.getNameInput().elementId)! as HTMLInputElement
    inputElement.select()
  }

  render(): ReactNode {

    const mutationFn = () => editLogGroup({
      name: this.getNameInput().getFormattedValue()
    }, this.props.logGroup.id!)

    return <LogGroupContext.Consumer>
      {(context) =>{

        const onSettled = (result: ILogGroup | undefined) =>{
          if (!result)
            this.getNameInput().updateValue(this.props.logGroup.name)
          else{
            context.updateExistingGroup(result)
          }
          this.props.onBlur()
        }

        return <MutationComponent mutationFn={mutationFn} onSettled={onSettled}>
          {({mutate}) =>{

            const keyDown = (e: KeyboardEvent<HTMLInputElement>) =>{
              if (e.key === 'Enter')
                mutate()
            }
            return <CTextInput input="name" onClick={e => e.stopPropagation()} onBlur={() => mutate()} onKeyDown={keyDown}
              inputClass='edit-title-input group-title-box fg1 bold'/>
            }
          }
      </MutationComponent>
      }}
    </LogGroupContext.Consumer>

  }
}