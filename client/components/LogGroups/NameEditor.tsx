import { Component, ContextType, ReactNode } from "react";
import { FormBuilder } from "../SimpleForm/Form/SimpleForm";
import SimpleTextInput from "../SimpleForm/Inputs/SimpleTextInput";
import SimpleFormContainer from "../SimpleForm/Form/SimpleFormContainer";
import { ILogGroupContext, LogGroupContext } from "./LGContext";
import { SimpleFormContext } from "../SimpleForm/Form/SimpleFormProvider";
import CTextInput from "../SimpleForm/Components/CTextInput";

interface Props{

}

export default class NameEditor extends Component<Props>{
  static contextType  = SimpleFormContext

  context!: ContextType<typeof SimpleFormContext>

  constructor(props: Props){
      super(props)
  }

  render(): ReactNode {
    return <LogGroupContext.Consumer>
      {(context: ILogGroupContext | undefined) =>{

        const formBuilder = (form) =>{
          const nameInput = new SimpleTextInput('name')
          nameInput.useContainer = false
          nameInput.useInputBox = false

          form.addInput(nameInput)
        }

        return <SimpleFormContainer id={'name-editor-' + context?.logGroup.id} formBuilder={this.formBuilder}>
          <CTextInput input='name'/>
        </SimpleFormContainer>
      }}
    </LogGroupContext.Consumer> 
  }
}