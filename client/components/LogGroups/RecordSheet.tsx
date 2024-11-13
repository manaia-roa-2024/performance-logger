import { Component, ReactNode } from 'react'
import LogRecord from '../../../models/classes/LogRecord'
import SimpleFormContainer from '../SimpleForm/Form/SimpleFormContainer'
import SimpleForm, { FormBuilder } from '../SimpleForm/Form/SimpleForm'
import { SimpleFormInstanceContext } from '../SimpleForm/Form/SimpleFormInstance'
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

interface Props {
  logRecords: LogRecord[]
}

export default class RecordSheet extends Component<Props> {

  constructor(props: Props) {
    super(props)

  }

  render() {
    return (
              <InnerSheet {...this.props} />
          )
  }
}

class InnerSheet extends Component<Props> {
  static contextType = SimpleFormInstanceContext

  context!: React.ContextType<typeof SimpleFormInstanceContext>

  incrementEntryDate(incrementer: number) {
    if (!this.context) return
    const dateInput = this.context.form.getInput(
      'date-entry',
    ) as SimpleDateInput
    const asDate = dateInput.asDate()
    asDate.setDate(asDate.getDate() + incrementer)
    dateInput.updateValue(SimpleDateInput.toISODate(asDate))
  }

  addNewEntry(context: ILogGroupContext) {
    /*if (!this.context) return
    const dateInput = this.context.form.getInput(
      'date-entry',
    ) as SimpleDateInput
    const valueInput = this.context.form.getInput(
      'value-entry',
    ) as SimpleNumberInput
    const record = new LogRecord()
    record.id = this.props.logRecords.length + 1
    record.logGroup = this.props.logRecords[0].logGroup
    record.value = valueInput.getFormattedValue()
    record.date = dateInput.value!
    this.props.logRecords.push(record)
    this.context.form.addInput(CellInput(record))
    //context.correctHeightFn()
    this.forceUpdate()*/
  }

  render(): ReactNode {
    return (
      <div className="record-sheet">
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
              />
              <CDateInput input="date-entry" />
              <Caret
                left={false}
                title="Increase date"
                onClick={() => this.incrementEntryDate(1)}
              />
            </Box>
            <Box className="value-plus-box">
              <LogGroupContext.Consumer>
                {(context: ILogGroupContext | undefined) => {
                  return (
                    <>
                      <CNumberInput input="value-entry" />
                      <div
                        className="simple-center data-entry-plus"
                        onClick={() => this.addNewEntry(context!)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                    </>
                  )
                }}
              </LogGroupContext.Consumer>
            </Box>
          </Box>
          <Box className="aic entry-row">
            <CPickOneDropdown input='metric-dropdown'/>
            <CPickOneDropdown input='unit-dropdown'/>
          </Box>
        </VertBox>
        <VertBox className="record-lower thin-scrollbar">
          {this.props.logRecords.map((logRecord, index) => {
            return <CLogRecord key={logRecord.id} logRecord={logRecord} />
          })}
        </VertBox>
      </div>
    )
  }
}

class Caret extends Component<{
  left: boolean
  title?: string
  onClick: React.MouseEventHandler<HTMLDivElement>
}> {
  render() {
    return (
      <div
        className="simple-center caret-box cp"
        title={this.props.title}
        onClick={this.props.onClick}
      >
        <FontAwesomeIcon
          fontSize={'25px'}
          icon={this.props.left ? faCaretLeft : faCaretRight}
        />
      </div>
    )
  }
}
