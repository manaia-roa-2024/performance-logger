import { Component, ReactNode } from 'react'
import { ILogRecord, PartialLogRecord } from '../../../models/classes/LogRecord'
import { ISimpleFormInstanceContext, SimpleFormInstanceContext } from '../SimpleForm/Form/SimpleFormInstance'
import { Box, VertBox } from '../Box'
import SimpleDateInput from '../SimpleForm/Inputs/SimpleDateInput'
import CDateInput from '../SimpleForm/Components/CDateInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import CNumberInput from '../SimpleForm/Components/CNumberInput'
import { ILogGroupContext, LogGroupContext } from './LGContext'
import { CLogRecord } from './CLogRecord'
import CPickOneDropdown from '../SimpleForm/Components/CPickOneDropdown'
import { MetricHandler } from '../../../models/classes/MetricHandler'
import { SimpleNumberInput } from '../SimpleForm/Inputs/SimpleNumberInput'
import { addLogRecord } from '../../apis/addLogRecord'
import MutationComponent from '../MutationComponent'
import { UseMutateFunction } from '@tanstack/react-query'
import SimpleTimeInput from '../SimpleForm/Inputs/SimpleTimeInput'
import SimpleForm from '../SimpleForm/Form/SimpleForm'
import LogGroup from '../../../models/classes/LogGroup'
import GroupedSheet from './GroupedSheet'
import cls from '../SimpleForm/cls'
import Util from '../../../Util'


interface Props {
  logGroup: LogGroup
}

export default class RecordSheet extends Component<Props> {
  static contextType = SimpleFormInstanceContext
  context!: ISimpleFormInstanceContext<SimpleForm<object>, LogGroup>

  incrementEntryDate(incrementer: number) {
    if (!this.context.form) return
    const dateInput = this.context.form.getInput(
      'date-entry',
    ) as SimpleDateInput
    const asDate = dateInput.asDate()
    asDate.setDate(asDate.getDate() + incrementer)
    dateInput.updateValue(SimpleDateInput.toISODate(asDate))
  }

  getConvertedEntry(lg: LogGroup): number | null{
    const valueEntry = this.context.form?.getInput('value-entry') as SimpleNumberInput | SimpleTimeInput
    const validRgx: RegExp = (valueEntry instanceof SimpleNumberInput) ? valueEntry.validNumReg : valueEntry.validTimeReg

    if (valueEntry.value == null || valueEntry.value === '' || !validRgx.test(valueEntry.value)){
      //console.error("Invalid entry from the get go")
      return null
    }

    const converted = MetricHandler.convertToBase(lg.metric, lg.unit, valueEntry.value)

    if (converted == null){
      //console.error("Conversion fail")
      return null
    }

    return converted
  }

  addNewEntry(context: ILogGroupContext, mutate: UseMutateFunction<unknown, Error, PartialLogRecord, unknown>) {
    const converted = this.getConvertedEntry(context.logGroup)

    if (converted === null) return

    mutate({
      value: converted,
      logGroupId: context.logGroup.id!,
      date: this.getDateEntry().value!
    })
  }

  getDateEntry(){
    return this.context.form!.getInput('date-entry') as SimpleDateInput
  }

  getValueEntry(){
    return this.context.form!.getInput('value-entry') as SimpleNumberInput
  }

  render(): ReactNode {
    return (
      <LogGroupContext.Consumer>
        {(context: ILogGroupContext) => {

          const mutationFn = (newRecord: PartialLogRecord) => addLogRecord(newRecord)

          const onSuccess = (result: ILogRecord) =>{
            context.addNewLogRecord(result)

            this.incrementEntryDate(1)
            this.getValueEntry().updateValue('')
          }

          return <div className="record-sheet">
            <VertBox className="record-head" gap="5px">
              <h5 className="tac" style={{ fontSize: '16px' }}>
                Data Entry
              </h5>
              <Box className="aic entry-row">
                <Box className="date-caret-box">
                  <Caret
                    left={true}
                    title="Decrease date"
                    onClick={() => this.incrementEntryDate(-1)}
                    tabIndex={context.tabIndex}
                  />
                  <CDateInput input="date-entry" tabIndex={context.tabIndex}/>
                  <Caret
                    left={false}
                    title="Increase date"
                    onClick={() => this.incrementEntryDate(1)}
                    tabIndex={context.tabIndex}
                  />
                </Box>
                <Box className="value-plus-box">
                  <MutationComponent mutationFn={mutationFn} onSuccess={onSuccess}>
                    {
                      ({mutate}) => {
                        return <>
                          <CNumberInput input="value-entry" onKeyDown={(e) => {if (e.key === 'Enter') this.addNewEntry(context!, mutate)}} tabIndex={context.tabIndex}/>
                          <button className={cls("simple-center data-entry-plus", this.getConvertedEntry(context.logGroup) == null && 'invalid-entry')} 
                          onClick={() => this.addNewEntry(context!, mutate)} tabIndex={context.tabIndex} title='Add Record'>
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </>
                      }
                    }
                  </MutationComponent>
                </Box>
              </Box>
              <Box className="aic entry-row">
                <CPickOneDropdown input='metric-dropdown' tabIndex={context.tabIndex}/>
                <CPickOneDropdown input='unit-dropdown' tabIndex={context.tabIndex}/>
              </Box>
              <Box className='aic entry-row'>
                <CPickOneDropdown input='groupby-dropdown' tabIndex={context.tabIndex}/>
                <CPickOneDropdown input='graphtype-dropdown' tabIndex={context.tabIndex}/>
              </Box>
            </VertBox>
            <VertBox className="record-lower thin-scrollbar">
              {this.props.logGroup.groupBy === 'none' && <>
                <Box className="record-row">
                  <div style={{cursor: 'default'}} className='record-cell trash static simple-center'>
                      
                  </div>
                  <div className="record-cell static df aic bold">
                    Date
                  </div>
                  <div className="record-cell static df aic bold">
                    Value
                  </div>
                </Box>
                {this.props.logGroup.logRecords.map((logRecord) => <CLogRecord key={logRecord.id} logRecord={logRecord} />)}
              
              </>}
              {this.props.logGroup.groupBy !== 'none' && <GroupedSheet/>}
            </VertBox>
          </div>
        }
      }
      </LogGroupContext.Consumer>
    )
  }
}

class Caret extends Component<{
  left: boolean
  title?: string
  onClick: React.MouseEventHandler<HTMLDivElement>
  tabIndex: number | undefined
}> {
  render() {
    return (
      <div role="button" tabIndex={this.props.tabIndex} onKeyDown={Util.divButtonHandler} className="simple-center caret-box cp" title={this.props.title} onClick={this.props.onClick}>
        <FontAwesomeIcon
          fontSize={'25px'}
          icon={this.props.left ? faCaretLeft : faCaretRight}
        />
      </div>
    )
  }
}
