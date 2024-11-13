import React from "react"
import LogGroup from "../../../models/classes/LogGroup"
import { ReactNode } from "react"
import { FormBuilder } from "../SimpleForm/Form/SimpleForm"
import SimpleDateInput from "../SimpleForm/Inputs/SimpleDateInput"
import { SimpleNumberInput } from "../SimpleForm/Inputs/SimpleNumberInput"
import CellInput from "../InputTemplates/CellInput"
import SimpleFormContainer from "../SimpleForm/Form/SimpleFormContainer"
import SimpleTextInput from "../SimpleForm/Inputs/SimpleTextInput"

export interface ILogGroupContext {
  /*correctHeightFn: () => void*/
  reload: () => void
  logGroup: LogGroup
}

type Props = ILogGroupContext & {children?: ReactNode}

export const LogGroupContext = React.createContext<ILogGroupContext>({
  reload: () => {},
  logGroup: new LogGroup()
})

export class LGProvider extends React.Component<Props>{
  formBuilder: FormBuilder
  
  constructor(props: Props){
    super(props)

    this.formBuilder = (form) => {
      const nameInput = new SimpleTextInput('name')
      nameInput.useContainer = false
      nameInput.useInputBox = false
      nameInput.value = props.logGroup.name
      nameInput.placeholder = 'Enter Name'

      const dateEntry = new SimpleDateInput('date-entry')
      dateEntry.inputClass = 'entry-input entry-date'
      dateEntry.useInputBox = false
      dateEntry.useContainer = false

      const valueEntry = new SimpleNumberInput('value-entry')
      valueEntry.inputClass = 'entry-input entry-value'
      valueEntry.useInputBox = false
      valueEntry.useContainer = false
      valueEntry.placeholder = 'New Entry'

      for (const logRecord of this.props.logGroup.logRecords) {
        form.addInput(CellInput(logRecord))
      }

      form.addInputs(nameInput, dateEntry, valueEntry)
    }
  }

  render(): ReactNode {
    return <LogGroupContext.Provider value={{reload: this.props.reload, logGroup: this.props.logGroup
    }}>
      <SimpleFormContainer id={this.props.logGroup.formId()} formBuilder={this.formBuilder}>
        {this.props.children}
      </SimpleFormContainer>
    </LogGroupContext.Provider>
  }
}