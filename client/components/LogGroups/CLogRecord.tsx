import { Component, ReactNode, useContext} from 'react'
import LogRecord, { ILogRecord } from '../../../models/classes/LogRecord'
import { Box } from '../Box'
import { LogGroupContext } from './LGContext'
import CTextInput from '../SimpleForm/Components/CTextInput'
import MutationComponent from '../MutationComponent'
import deleteRecord from '../../apis/deleteRecord'
import { UseMutateFunction, useMutation, UseMutationResult } from '@tanstack/react-query'
import cls from '../SimpleForm/cls'
import request from 'superagent'
import { ISimpleFormInstanceContext, SimpleFormInstanceContext } from '../SimpleForm/Form/SimpleFormInstance'
import LogGroup from '../../../models/classes/LogGroup'
import SimpleForm from '../SimpleForm/Form/SimpleForm'
import { MetricHandler } from '../../../models/classes/MetricHandler'
import SimpleTextInput from '../SimpleForm/Inputs/SimpleTextInput'

interface Props{
  logRecord: LogRecord
}

interface State{
  recordFocused: boolean
}

export class CLogRecord extends Component<Props, State> {

  static contextType = SimpleFormInstanceContext
  context!: ISimpleFormInstanceContext<SimpleForm<object>, LogGroup>

  recordId: string // element and formId not db id

  constructor(props: Props){
    super(props)

    this.state = {
      recordFocused: false
    }

    this.recordId = 'record-input-' + props.logRecord.id
  }

  render() {
    const record = this.props.logRecord

    return (
      <Mutations>
        {
          (remove, modify) =>{

            const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Delete') {
                remove.mutate(this.props.logRecord.id!)
              }
            }
        
            const onFocus = () =>{
              this.setState(prev =>{
                return {...prev, recordFocused: true}
              })
            }
        
            const onBlur = () =>{
              const startValue = record.getConvertedValue()
              console.group("Cell Values")
              console.log("Initial Value:", startValue)

              const input = this.context.form.getInput(this.recordId)! as SimpleTextInput
              const baseValue = MetricHandler.convertToBase(record.logGroup.metric, record.logGroup.unit, input.value!)
              console.log('Input value:', input.value)
              console.log('Base Value:', baseValue)
              console.groupEnd()

              if (startValue === input.value)
                return

              if (baseValue == null){
                input.updateValue(startValue)
                return
              }

              modify.mutate({id: record.id, value: baseValue})

              this.setState(prev =>{
                return {...prev, recordFocused: false}
              })
            }
        
            const onEnter = () =>{
              document.getElementById(this.recordId)?.blur()
            }

            return (
              <Box className={cls("record-row", this.state.recordFocused && 'focused')}>
                <div className="record-cell df aic">
                  {this.props.logRecord.date}
                </div>
                <div className="record-cell df aic">
                  <CTextInput input={'record-input-' + this.props.logRecord.id} onEnter={onEnter} onKeyDown={keyDown} onFocus={onFocus} onBlur={onBlur}/>
                </div>
              </Box>
            )
          }
        } 
      </Mutations>
          
    )
  }
}

interface MutationsProps{
  children: (remove: UseMutationResult<number, Error, number, unknown>,
     modify: UseMutationResult<ILogRecord, Error, {id: number, value: number}, unknown>) => ReactNode
}

function Mutations(props: MutationsProps){
  const context = useContext(LogGroupContext)

  const remove = useMutation({
    mutationFn: (id: number) => deleteRecord(id),
    onSuccess: (id: number) => {
      context.deleteExistingLogRecord(id)
    }
  })
  const modify = useMutation({
    mutationFn: ({id, value}: {id: number, value: number}): Promise<ILogRecord> => {
      const result = request.patch('/api/v1/logrecord/' + id).send({value}).then(res =>{
        return res.body as ILogRecord
      })
      return result
    },
    onSuccess: (json: ILogRecord) => {
      context.updateExistingLogRecord(json)
    }
  })

  return props.children(remove, modify)
}