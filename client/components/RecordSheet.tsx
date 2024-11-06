import { Component, ReactNode } from 'react'
import LogRecord from '../../models/classes/LogRecord'
import SimpleFormContainer from './SimpleForm/Form/SimpleFormContainer'
import SimpleForm from './SimpleForm/Form/SimpleForm'
import SimpleTextInput from './SimpleForm/Inputs/SimpleTextInput'
import CTextInput from './SimpleForm/Components/CTextInput'
import { SimpleFormInstanceContext } from './SimpleForm/Form/SimpleFormInstance'
import useSimpleForm from './SimpleForm/Form/useSimpleForm'
import { Box, VertBox } from './Box'
import SimpleDateInput from './SimpleForm/Inputs/SimpleDateInput'
import CDateInput from './SimpleForm/Components/CDateInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


interface Props{
  logRecords: LogRecord[]
}


export default class RecordSheet extends Component<Props>{
  formBuilder: (form: SimpleForm<Record<string, unknown>>) => void

  constructor(props: Props){
    super(props)

    this.formBuilder = (form) =>{
      const dateEntry = new SimpleDateInput('date-entry')
      dateEntry.inputClass = 'entry-input entry-date'
      dateEntry.useInputBox = false
      dateEntry.useContainer = false

      const valueEntry = new SimpleTextInput('value-entry')
      valueEntry.inputClass = 'entry-input entry-value'
      valueEntry.useInputBox = false
      valueEntry.useContainer = false
      valueEntry.placeholder = 'New Entry'

      for (const logRecord of this.props.logRecords){
        const input = new SimpleTextInput('record-input-' + logRecord.id)
        input.value = logRecord.value.toString()
        input.inputClass = 'cell-input'
        input.useContainer = false
        input.useInputBox = false
        form.addInput(input)
      }

      form.addInputs(dateEntry, valueEntry)
    }
  }

  render() {

    return (
      <SimpleFormContainer id='record-sheet' formBuilder={this.formBuilder}>
        <InnerSheet {...this.props}/>
      </SimpleFormContainer>  
    )
  }
}

class InnerSheet extends Component<Props>{
  render(): ReactNode {
    return <div className='record-sheet'>
      <VertBox className='record-head' gap='5px'>
        <h5 className='tac' style={{fontSize: '16px'}}>Data Entry</h5>
        <Box className='aic entry-row'>
          <CDateInput input='date-entry'/>
          <Box className='value-plus-box'>
            <CTextInput input='value-entry'/>
            <div className='simple-center data-entry-plus'>
              <FontAwesomeIcon icon={faPlus}/>
            </div>
          </Box>
        </Box>
      </VertBox>
      {this.props.logRecords.map((logRecord, index) =>{
        return (<Box key={logRecord.id} className='record-row'>
            <div className='record-cell df aic'>
              {logRecord.date}
            </div>
            <div className='record-cell df aic'>
              <CTextInput input={'record-input-' + logRecord.id}/>
            </div>
          </Box>)
        })
      }
    </div>
  }
}
