import { Component, ReactNode, useContext} from 'react'
import LogRecord, { ILogRecord } from '../../../models/classes/LogRecord'
import { Box } from '../Box'
import { ILogGroupContext, LogGroupContext } from './LGContext'
import CTextInput from '../SimpleForm/Components/CTextInput'
import deleteRecord from '../../apis/deleteRecord'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import cls from '../SimpleForm/cls'
import request from 'superagent'
import { ISimpleFormInstanceContext, SimpleFormInstanceContext } from '../SimpleForm/Form/SimpleFormInstance'
import LogGroup from '../../../models/classes/LogGroup'
import SimpleForm from '../SimpleForm/Form/SimpleForm'
import { MetricHandler } from '../../../models/classes/MetricHandler'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Util from '../../../Util'
import SimpleKeyboardInput from '../SimpleForm/Inputs/SimpleKeyboardInput'

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

  componentDidMount(): void {
    if (this.props.logRecord.freshlyAdded){
      this.props.logRecord.freshlyAdded = false
      this.forceUpdate()
    }
  }

  getRecordInput(){
    const input = this.context.form.getInput(this.recordId) as SimpleKeyboardInput | undefined
    if (!input)
      throw new Error("Could not find input for id of " + this.recordId)
    return input
  }

  render() {
    const record = this.props.logRecord
    const recordInput = this.getRecordInput()

    return (
      <Mutations>
        {
          (remove, modify) =>{

            const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Delete') {
                //remove.mutate(this.props.logRecord.id)
              }
            }
        
            const onFocus = () =>{
              this.setState(prev =>{
                return {...prev, recordFocused: true}
              })
            }
        
            const onBlur = () =>{
              const startValue = record.getConvertedValue()

              const input = recordInput
              const baseValue = MetricHandler.convertToBase(record.logGroup.metric, record.logGroup.unit, input.value!)

              this.setState(prev =>{
                return {...prev, recordFocused: false}
              })

              if (startValue === input.value)
                return

              if (baseValue == null){
                input.updateValue(startValue)
                return
              }

              modify.mutate({id: record.id, value: baseValue})
            }
        
            const onEnter = () =>{
              document.getElementById(this.recordId)?.blur()
            }

            return (
              <LogGroupContext.Consumer>
                {(context: ILogGroupContext) =>{

                  const baseValue = MetricHandler.convertToBase(context.logGroup.metric, context.logGroup.unit, recordInput.value!)

                  let cellTitle: string | undefined = undefined
                  if (baseValue == null)
                    cellTitle = 'Value is invalid'
                  else if (!this.state.recordFocused)
                    cellTitle = 'Edit Record'
                  
                  return <Box className={cls("record-row", this.state.recordFocused && 'focused', this.props.logRecord.freshlyAdded && 'freshly-added', baseValue == null && 'invalid')}>
                    <div tabIndex={context.tabIndex} role="button" onKeyDown={Util.divButtonHandler} className='record-cell trash static simple-center' title='Delete Record' onClick={() => remove.mutate(this.props.logRecord.id)}>
                      
                      <FontAwesomeIcon icon={faTrash}/>
                    </div>
                    <div className="record-cell static df aic">
                      {LogGroup.standardDate(this.props.logRecord.date)}
                    </div>
                    <div className="record-cell df aic">
                      <CTextInput input={'record-input-' + this.props.logRecord.id} title={cellTitle} onEnter={onEnter} onKeyDown={keyDown} onFocus={onFocus} onBlur={onBlur} tabIndex={context.tabIndex}/>
                    </div>
                  </Box>
                }}
              </LogGroupContext.Consumer>
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