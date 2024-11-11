import { Component} from 'react'
import LogRecord from '../../../models/classes/LogRecord'
import { SimpleFormInstanceContext } from '../SimpleForm/Form/SimpleFormInstance'
import { Box } from '../Box'
import { ILogGroupContext, LogGroupContext } from './LGContext'
import CTextInput from '../SimpleForm/Components/CTextInput'


export class CLogRecord extends Component<{ logRecord: LogRecord }> {
  static contextType = SimpleFormInstanceContext

  context!: React.ContextType<typeof SimpleFormInstanceContext>

  render() {

    const keyDown = (e: React.KeyboardEvent<HTMLInputElement>, lgContext: ILogGroupContext) => {
      if (e.key === 'Delete') {
        /*console.log(lgContext)
        const index = lgContext.logGroup.logRecords.indexOf(this.props.logRecord)
        lgContext.logGroup.logRecords.splice(index, 1)
        this.context?.form.removeInput('record-input-' + this.props.logRecord.id)
        lgContext.reload()*/
      }
    }

    return (
      <LogGroupContext.Consumer>
        {(lgContext: ILogGroupContext | undefined) => {
          return (
            <Box className="record-row">
              <div className="record-cell df aic">
                {this.props.logRecord.date}
              </div>
              <div className="record-cell df aic">
                <CTextInput input={'record-input-' + this.props.logRecord.id} onKeyDown={(e) => keyDown(e, lgContext!)}/>
              </div>
            </Box>
          )
        }}
      </LogGroupContext.Consumer>
    )
  }
}