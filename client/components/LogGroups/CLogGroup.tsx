import { Component } from 'react'
import { Box, VertBox } from '../Box'
import LogGroup from '../../../models/classes/LogGroup'
import cls from '../SimpleForm/cls'
import RecordSheet from './RecordSheet'
import getLogRecords from '../../apis/getLogRecords'
import { LGProvider } from './LGContext'
import LGHead from './LGHead'
import GroupMain from './GroupMain/GroupMain'
import QueryComponent from '../QueryComponent'

interface Props {
  logGroup: LogGroup
}

interface State {
  open: boolean
}

export default class CLogGroup extends Component<Props, State> {
  rand: number

  constructor(props: Props) {
    super(props)

    this.state = {
      open: false,
    }

    this.rand = Math.random()
  }

  headClick() {
    this.setState((prev) => {
      return {
        ...prev,
        open: !prev.open,
      }
    })
  }

  render() {
    const queryFn = () =>{
      return getLogRecords(this.props.logGroup) 
    }

    return (
      <QueryComponent queryKey={['records', this.props.logGroup.id.toString()]} queryFn={queryFn}>
        {({data: seed, isPending, isError}) =>{

          if (isPending) return <p>Pending...</p>

          if (isError || !seed)
            return <p>There was an error loading your records</p>

          return <LGProvider logGroup={this.props.logGroup} open={this.state.open}>
            <VertBox className="log-group black-border c-white">
              <LGHead onClick={() => this.headClick()} open={this.state.open} groupName={this.props.logGroup.name}/>
              <div className={cls('log-lower', 'c-black', !this.state.open && 'closed')}
                style={{ height: this.state.open ? 'var(--log-lower-height)' : '0' }}>
                <Box className="log-inner">
                  <GroupMain/>
                  <RecordSheet logGroup={this.props.logGroup} />
                </Box>
              </div>
            </VertBox>
          </LGProvider>
        }}
      </QueryComponent>
    )
  }
}
