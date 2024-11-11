import { Component, Context, ReactNode } from 'react'
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
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { SimpleNumberInput } from './SimpleForm/Inputs/SimpleNumberInput'
import CNumberInput from './SimpleForm/Components/CNumberInput'
import CellInput from './InputTemplates/CellInput'
import { ILogGroupContext, LogGroupContext } from './LogGroups'


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

      const valueEntry = new SimpleNumberInput('value-entry')
      valueEntry.inputClass = 'entry-input entry-value'
      valueEntry.useInputBox = false
      valueEntry.useContainer = false
      valueEntry.placeholder = 'New Entry'

      for (const logRecord of this.props.logRecords){
        form.addInput(CellInput(logRecord))
      }

      form.addInputs(dateEntry, valueEntry)
    }
  }

  render() {
    return (
      <LogGroupContext.Consumer>
        {(context: ILogGroupContext | undefined) =>{

          return <SimpleFormContainer id={'record-sheet-' + context.logGroup.id} formBuilder={this.formBuilder}>
            <InnerSheet {...this.props}/>
          </SimpleFormContainer>     
        }}
      </LogGroupContext.Consumer>
    )
  }
}

class InnerSheet extends Component<Props>{
  static contextType = SimpleFormInstanceContext

  context!: React.ContextType<typeof SimpleFormInstanceContext>

  incrementEntryDate(incrementer: number){
    if (!this.context) return
    const dateInput = this.context.form.getInput('date-entry') as SimpleDateInput
    const asDate = dateInput.asDate()
    asDate.setDate(asDate.getDate() + incrementer)
    dateInput.updateValue(SimpleDateInput.toISODate(asDate))
  }

  addNewEntry(context: ILogGroupContext){
    if (!this.context) return
    const dateInput = this.context.form.getInput('date-entry') as SimpleDateInput
    const valueInput = this.context.form.getInput('value-entry') as SimpleNumberInput
    const record = new LogRecord()
    record.id = this.props.logRecords.length + 1
    record.logGroup = this.props.logRecords[0].logGroup
    record.value = valueInput.getFormattedValue()
    record.date = dateInput.value!
    this.props.logRecords.push(record)
    this.context.form.addInput(CellInput(record))
    //context.correctHeightFn()
    this.forceUpdate()
  }

  render(): ReactNode {
    return <div className='record-sheet'>
      <VertBox className='record-head' gap='5px'>
        <h5 className='tac' style={{fontSize: '16px'}}>Data Entry</h5>
        <Box className='aic entry-row'>
          <Box className='date-caret-box'>
            <Caret left={true} title='Decrease date' onClick={() => this.incrementEntryDate(-1)}/>
            <CDateInput input='date-entry'/>
            <Caret left={false} title='Increase date' onClick={() => this.incrementEntryDate(1)}/>
          </Box>
          <Box className='value-plus-box'>
            <LogGroupContext.Consumer>
              {(context: ILogGroupContext | undefined) =>{
                console.log(context)
                console.log(this.context)
                return (
                <>
                  <CNumberInput input='value-entry'/>
                  <div className='simple-center data-entry-plus' onClick={() => this.addNewEntry(context!)}>
                    <FontAwesomeIcon icon={faPlus}/>
                  </div>
                  </>)
              }}
            </LogGroupContext.Consumer> 
          </Box>
        </Box>
      </VertBox>
      <VertBox className='record-lower thin-scrollbar'>
        {this.props.logRecords.map((logRecord, index) =>{
          return (<CLogRecord key={logRecord.id} logRecord={logRecord}/>)
        })}
      </VertBox>
      
    </div>
  }
}

class CLogRecord extends Component<{logRecord: LogRecord}>{

  static contextType = SimpleFormInstanceContext

  context!: React.ContextType<typeof SimpleFormInstanceContext>

  render(){

    const keyDown = (e: React.KeyboardEvent<HTMLInputElement>, lgContext: ILogGroupContext) =>{
      if (e.key === 'Delete'){
        console.log(lgContext)
        const index = lgContext.logRecords.indexOf(this.props.logRecord)
        lgContext.logRecords.splice(index, 1)
        this.context?.form.removeInput('record-input-' + this.props.logRecord.id)
        lgContext.reload()
      }
    }
    return (
    <LogGroupContext.Consumer>
      {(lgContext: ILogGroupContext | undefined) =>{
        return <Box className='record-row'>
          <div className='record-cell df aic'>
            {this.props.logRecord.date}
          </div>
          <div className='record-cell df aic'>
            <CTextInput input={'record-input-' + this.props.logRecord.id} onKeyDown={(e) => keyDown(e, lgContext!)}/>
          </div>
        </Box>
      }}
    </LogGroupContext.Consumer>)
  }
  
}

class Caret extends Component<{left: boolean, title?: string, onClick: React.MouseEventHandler<HTMLDivElement>}>{

  render(){
    return <div className='simple-center caret-box cp' title={this.props.title} onClick={this.props.onClick}>
      <FontAwesomeIcon fontSize={'25px'} icon={this.props.left ? faCaretLeft : faCaretRight}/>
    </div>
  }
}

