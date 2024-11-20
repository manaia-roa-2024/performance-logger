import React, { ContextType } from "react"
import LogGroup, { ILogGroup } from "../../../models/classes/LogGroup"
import { ReactNode } from "react"
import SimpleForm, { FormBuilder } from "../SimpleForm/Form/SimpleForm"
import SimpleDateInput from "../SimpleForm/Inputs/SimpleDateInput"
import { SimpleNumberInput } from "../SimpleForm/Inputs/SimpleNumberInput"
import CellInput from "../InputTemplates/CellInput"
import SimpleFormContainer, { SimpleFormConsumer } from "../SimpleForm/Form/SimpleFormContainer"
import SimpleTextInput from "../SimpleForm/Inputs/SimpleTextInput"
import { SimpleFormContext } from "../SimpleForm/Form/SimpleFormProvider"
import PickOneDropdownInput from "../SimpleForm/Inputs/PickOneDropdownInput"
import { MetricHandler } from "../../../models/classes/MetricHandler"
import MutationComponent from "../MutationComponent"
import editLogGroup from "../../apis/editLogGroup"
import { QueryClient } from "@tanstack/react-query"
import LogCollection from "../../../models/classes/LogCollection"
import SimpleTimeInput from "../SimpleForm/Inputs/SimpleTimeInput"

export interface ILogGroupContext {
  logGroup: LogGroup,
  reload: () => void
}

type Props = {children?: ReactNode, logGroup: LogGroup}

export const LogGroupContext = React.createContext<ILogGroupContext>({
  reload: () => {},
  logGroup: new LogGroup()
})

export class LGProvider extends React.Component<Props>{
  static contextType = SimpleFormContext

  context!: ContextType<typeof SimpleFormContext>

  formBuilder: FormBuilder<object, LogGroup>

  logGroup: LogGroup
  
  constructor(props: Props){
    super(props)
    this.logGroup = props.logGroup
    this.formBuilder = (form, logGroup) => {
      console.log("Building form")
      const nameInput = new SimpleTextInput('name')
      nameInput.useContainer = false
      nameInput.useInputBox = false
      nameInput.value = logGroup.name
      nameInput.placeholder = 'Enter Name'

      const dateEntry = new SimpleDateInput('date-entry')
      dateEntry.inputClass = 'entry-input entry-date'
      dateEntry.useInputBox = false
      dateEntry.useContainer = false

      let valueEntry: SimpleNumberInput | SimpleTimeInput
      if (logGroup.unit !== 'duration'){
        valueEntry = new SimpleNumberInput('value-entry')
        valueEntry.placeholder = 'New Entry'
      } else{
        valueEntry = new SimpleTimeInput('value-entry')
        valueEntry.placeholder = 'hh:mm:ss'
      }

      valueEntry.inputClass = 'entry-input entry-value'
      valueEntry.useInputBox = false
      valueEntry.useContainer = false

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

  updateCellValues(logGroup: LogGroup, form: SimpleForm<object>){
    //console.log(logGroup)
    console.log(logGroup.logRecords)
    for (const record of logGroup.logRecords){
      const input = form.getInput('record-input-' + record.id)!
      const newValue = MetricHandler.convertTo(logGroup.metric, MetricHandler.getBaseUnit(logGroup.metric)!, logGroup.metric, logGroup.unit, record.value.toString())
      if (newValue == null)
        return console.error("Conversion fail")
      input.value = newValue.toString()
    }
  }


  componentWillUnmount(): void {
    this.context?.removeForm(this.props.logGroup.formId())
  }

  getForm(){
    return this.context!.getForm(this.props.logGroup.formId())! as SimpleForm<object>
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


  /*shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
    if (this.props.logGroup.unit !== nextProps.logGroup.unit){
      console.log("Component should update")
      return true
    }
    return false
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (prevProps.logGroup !== this.props.logGroup){

    }
  }*/

  render(): ReactNode {

    const mutationFn = () => {
      return editLogGroup({
        metric: this.dropdownMetric(),
        unit: this.dropdownUnit()
      }, this.props.logGroup.id!)
    }

    return <LogGroupContext.Provider value={{reload: this.forceUpdate, logGroup: this.props.logGroup}}>
      <SimpleFormContainer id={this.props.logGroup.formId()} formBuilder={this.formBuilder} variables={this.props.logGroup}>
        {
          (form, buildForm) =>{

            const onSuccess = (result: ILogGroup, queryClient: QueryClient) =>{
              queryClient.setQueryData(['log-collection'], (old: LogCollection) =>{
                const oldLogGroup = old.logGroups.find(x => x.id === result.id)
                const newLogGroup = LogGroup.Instance(result, old)
                old.logGroups = old.logGroups.map(lg =>{
                  if (lg.id === result.id){
                    newLogGroup.setRecords(lg.logRecords)
                    return newLogGroup
                  }
                  return lg
                })
                const clone = LogCollection.Clone(old)

                console.log(oldLogGroup, newLogGroup)
                if (newLogGroup.isDuration() != oldLogGroup?.isDuration())
                  buildForm(newLogGroup)
                else
                  this.updateCellValues(newLogGroup, this.getForm())

                return clone
              })
              //buildForm()
            }
            //console.log(MetricHandler.convertToBase('time', 'duration', this.getForm().getInput('time-entry')!.value))
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
  }
}