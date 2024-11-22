import { Component} from 'react'
import LogRecord from '../../../models/classes/LogRecord'
import { Box } from '../Box'
import { LogGroupContext } from './LGContext'
import CTextInput from '../SimpleForm/Components/CTextInput'
import MutationComponent from '../MutationComponent'
import deleteRecord from '../../apis/deleteRecord'
import { UseMutateFunction } from '@tanstack/react-query'


export class CLogRecord extends Component<{ logRecord: LogRecord }> {
  static contextType = LogGroupContext

  context!: React.ContextType<typeof LogGroupContext>

  render() {

    const keyDown = (e: React.KeyboardEvent<HTMLInputElement>, mutate: UseMutateFunction<unknown, Error, number, unknown>) => {
      if (e.key === 'Delete') {
        mutate(this.props.logRecord.id!)
      }
    }

    const mutationFn = (id: number) => deleteRecord(id)

    const onSuccess = () =>{
      this.context.deleteExistingLogRecord(this.props.logRecord.id)
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