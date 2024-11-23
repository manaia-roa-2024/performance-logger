import React, { ContextType } from "react"
import LogGroup, { ILogGroup } from "../../../models/classes/LogGroup"
import { ReactNode } from "react"
import SimpleForm, { FormBuilder } from "../SimpleForm/Form/SimpleForm"
import SimpleDateInput from "../SimpleForm/Inputs/SimpleDateInput"
import CellInput from "../InputTemplates/CellInput"
import SimpleFormContainer from "../SimpleForm/Form/SimpleFormContainer"
import SimpleTextInput from "../SimpleForm/Inputs/SimpleTextInput"
import { SimpleFormContext } from "../SimpleForm/Form/SimpleFormProvider"
import PickOneDropdownInput from "../SimpleForm/Inputs/PickOneDropdownInput"
import { MetricHandler } from "../../../models/classes/MetricHandler"
import MutationComponent from "../MutationComponent"
import editLogGroup from "../../apis/editLogGroup"
import QCC from "../QCC"
import LogRecord, { ILogRecord } from "../../../models/classes/LogRecord"
import { NumberEntry, TimeEntry } from "../InputTemplates/Entries"
import { SimpleNumberInput } from "../SimpleForm/Inputs/SimpleNumberInput"

export interface ILogGroupContext {
  logGroup: LogGroup,
  reload: () => void,

  deleteExistingGroup: () => void,
  updateExistingGroup: (json: ILogGroup) => void,

  addNewLogRecord: (json: ILogRecord) => void,
  updateExistingLogRecord: (json: ILogRecord) => void,
  deleteExistingLogRecord: (id: number) => void
}

type Props = {
  children?: ReactNode, 
  logGroup: LogGroup
}

export const LogGroupContext = React.createContext<ILogGroupContext>({} as unknown as ILogGroupContext)

export class LGProvider extends React.Component<Props>{
  static contextType = SimpleFormContext

  context!: ContextType<typeof SimpleFormContext>

  formBuilder: FormBuilder<object, LogGroup>

  logGroup: LogGroup
  
  constructor(props: Props){
    super(props)
    this.logGroup = props.logGroup
    this.formBuilder = (form, logGroup) => {
      const nameInput = new SimpleTextInput('name')
      nameInput.useContainer = false
      nameInput.useInputBox = false
      nameInput.value = logGroup.name
      nameInput.placeholder = 'Enter Name'

      const dateEntry = new SimpleDateInput('date-entry')
      dateEntry.inputClass = 'entry-input entry-date'
      dateEntry.useInputBox = false
      dateEntry.useContainer = false

      const valueEntry = logGroup.isDuration() ? TimeEntry() : NumberEntry()

      if (valueEntry instanceof SimpleNumberInput && logGroup.isTime()){
        valueEntry.min = 0
      }

      const metricDropdown = new PickOneDropdownInput('metric-dropdown')
      metricDropdown.label = 'Metric'
      metricDropdown.containerClass = 'metric-dropdown-con vert-flex g3'
      metricDropdown.inputClass = 'metric-entry'
      metricDropdown.options = MetricHandler.getMetrics().map(([key, metric], i) =>{
        if (logGroup.metric === key)
          metricDropdown.value = i
        return {key, value: metric.alias}
      })

      const unitDropdown = new PickOneDropdownInput('unit-dropdown')
      unitDropdown.label = 'Unit'
      unitDropdown.containerClass = 'metric-dropdown-con vert-flex g3'
      unitDropdown.inputClass = 'metric-entry'
      unitDropdown.options = MetricHandler.getUnits(metricDropdown.getSelectedOption()!.key).map(([key, unit], i) =>{
        if (logGroup.unit === key)
          unitDropdown.value = i
        return {key, value: unit.alias}
      })
      

      for (const logRecord of logGroup.logRecords) {
        form.addInput(CellInput(logRecord))
      }
      this.updateCellValues(logGroup, form)

      form.addInputs(nameInput, dateEntry, valueEntry, metricDropdown, unitDropdown)
    }
  }

  updateCellValues(logGroup: LogGroup, form?: SimpleForm<object>){
    for (const record of logGroup.logRecords){
      this.updateCellValue(record, form ?? this.getForm())
    }
  }

  updateCellValue(record: LogRecord, form?: SimpleForm<object>){
    form = form ?? this.getForm()
    const input = form.getInput('record-input-' + record.id)!
    const newValue = record.getConvertedValue()
    if (newValue == null)
      return console.error("Conversion fail")
    input.value = newValue.toString()
  }

  resetForm(logGroup: LogGroup){
    logGroup = logGroup ?? this.logGroup
    this.context.getBuilder(this.logGroup.formId())?.apply(null, [logGroup])
  }

  componentWillUnmount(): void {
    this.context.removeForm(this.logGroup.formId())
  }

  getForm(){
    return this.context.getForm(this.logGroup.formId())! as SimpleForm<object>
  }

  getMetricDropdown(){
    return this.getForm().getInput('metric-dropdown') as PickOneDropdownInput
  }

  getUnitDropdown(){
    return this.getForm().getInput('unit-dropdown') as PickOneDropdownInput
  }

  dropdownMetric(){
    return this.getMetricDropdown().getSelectedOption()?.key
  }

  dropdownUnit(){
    return this.getUnitDropdown().getSelectedOption()?.key
  }

  render(): ReactNode {

    return (
      <QCC>
        {(queryClient) => {

          const deleteExistingGroup = () =>{
            const id = this.logGroup.id
            queryClient.setQueryData(['all-log-groups'], (old: Array<LogGroup>) =>{
              return old.filter(lg => lg.id !== id)
            })
          }

          const updateExistingGroup = (json: ILogGroup) =>{
            queryClient.setQueryData(['all-log-groups'], (old: Array<LogGroup>) =>{
              const mapped = old.map(lg =>{
                if (lg.id === json.id){
                  lg.update(json)
                  this.resetForm(lg)
                }
                return lg
              })
              return mapped
            })
          }

          const addNewLogRecord = (json: ILogRecord) =>{
            queryClient.setQueryData(['records', this.props.logGroup.id.toString()], (old: number) =>{
              const newRecord = this.logGroup.addJsonRecord(json)
              this.logGroup.sortRecords()
              const input = CellInput(newRecord)
              this.getForm().addInput(input)
              this.updateCellValue(newRecord)
              return old + 1 % 1_000_000
            })
          }

          const updateExistingLogRecord = (json: ILogRecord) =>{
            queryClient.setQueryData(['records', this.props.logGroup.id.toString()], (old: number) =>{
              for (const record of this.logGroup.logRecords){
                if (record.id === json.id){
                  record.update(json)
                  this.updateCellValue(record)
                }
              }
              return old + 1 % 1_000_000
            })
          }

          const deleteExistingLogRecord = (id: number) =>{
            queryClient.setQueryData(['records', this.props.logGroup.id.toString()], (old: number) =>{
              const recordIndex = this.logGroup.logRecords.findIndex(r => r.id===id)
              const deletedRecord = this.logGroup.logRecords[recordIndex]
              if (recordIndex < 0)
                throw new Error('Could not find record')
              this.getForm().removeInput('record-input-' + deletedRecord.id)
              this.logGroup.logRecords.splice(recordIndex, 1)
              return old + 1 % 1_000_000
            })
          }
          return <LogGroupContext.Provider value={{reload: this.forceUpdate, logGroup: this.props.logGroup, deleteExistingGroup, 
          updateExistingGroup, addNewLogRecord, updateExistingLogRecord, deleteExistingLogRecord}}>
            
            <SimpleFormContainer id={this.props.logGroup.formId()} formBuilder={this.formBuilder} variables={this.props.logGroup}>
              {
                () =>{
      
                  const onSuccess = (result: ILogGroup) =>{
                    updateExistingGroup(result)
                  }

                  const mutationFn = () => {
                    return editLogGroup({
                      metric: this.dropdownMetric(),
                      unit: this.dropdownUnit()
                    }, this.logGroup.id)
                  }

                return (

                  <MutationComponent mutationFn={mutationFn} onSuccess={onSuccess}>
                  {
                    ({mutate}) =>{
                      const md = this.getMetricDropdown()
                      const ud = this.getUnitDropdown()
                      md.updateValue = (newValue: number) =>{
                        md.value = newValue
                        const met = md.getSelectedOption()!.key
                        let base = 0
                        ud.options = MetricHandler.getUnits(met).map(([key, unit], i) =>{
                          if (key === MetricHandler.getBaseUnit(met))
                            base = i
                          return {key, value: unit.alias}
                        })
                        ud.updateValue(base)
                      }
      
                      ud.updateValue = (newValue: number) =>{
                        ud.value = newValue
                        mutate()
                        ud.reload()
                      }
      
                      return this.props.children
                    }
                  }
                  </MutationComponent>)
                }
              }
              
            </SimpleFormContainer>
          </LogGroupContext.Provider>
        }}
      
    </QCC>
    )
  }
}