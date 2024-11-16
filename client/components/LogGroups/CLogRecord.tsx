import { Component} from 'react'
import LogRecord from '../../../models/classes/LogRecord'
import { SimpleFormInstanceContext } from '../SimpleForm/Form/SimpleFormInstance'
import { Box } from '../Box'
import { ILogGroupContext, LogGroupContext } from './LGContext'
import CTextInput from '../SimpleForm/Components/CTextInput'
import MutationComponent from '../MutationComponent'
import deleteRecord from '../../apis/deleteRecord'
import { QueryClient, UseMutateFunction } from '@tanstack/react-query'


export class CLogRecord extends Component<{ logRecord: LogRecord }> {
  static contextType = SimpleFormInstanceContext

  context!: React.ContextType<typeof SimpleFormInstanceContext>

  render() {

    const keyDown = (e: React.KeyboardEvent<HTMLInputElement>, mutate: UseMutateFunction<unknown, Error, number, unknown>) => {
      if (e.key === 'Delete') {
        mutate(this.props.logRecord.id!)
        /*console.log(lgContext)
        const index = lgContext.logGroup.logRecords.indexOf(this.props.logRecord)
        lgContext.logGroup.logRecords.splice(index, 1)
        this.context?.form.removeInput('record-input-' + this.props.logRecord.id)
        lgContext.reload()*/
      }
    }

    const mutationFn = (id: number) => deleteRecord(id)

    const onSuccess = (result: unknown, queryClient: QueryClient) =>{
      const id = this.props.logRecord.id!
      console.log("Record deleted:", id)
      queryClient.setQueryData(['records', this.props.logRecord.logGroup!.id!.toString()], (old: number) =>{
        
        this.props.logRecord.logGroup!.removeById(id)
        return (old + 1) % 1_000_000
      })
      this.context.form!.removeInput('record-input-' + id)
    }

    return (
      <MutationComponent mutationFn={mutationFn} onSuccess={onSuccess}>
        {
          ({mutate}) =>{
            return (
              <Box className="record-row">
                <div className="record-cell df aic">
                  {this.props.logRecord.date}
                </div>
                <div className="record-cell df aic">
                  <CTextInput input={'record-input-' + this.props.logRecord.id} onKeyDown={(e) => keyDown(e, mutate)}/>
                </div>
              </Box>
            )
          }
        } 
      </MutationComponent>
          
    )
  }
}