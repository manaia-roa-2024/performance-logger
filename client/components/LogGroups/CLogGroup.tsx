import { Component, createRef, RefObject } from 'react'
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
  lowerHeight: string
}

export default class CLogGroup extends Component<Props, State> {
  lowerRef: RefObject<HTMLDivElement>
  rand: number

  constructor(props: Props) {
    super(props)

    this.state = {
      open: true,
      lowerHeight: '0',
    }
    this.rand = Math.random()
    this.lowerRef = createRef()
  }

  headClick() {
    this.setState((prev) => {
      return {
        ...prev,
        open: !prev.open,
      }
    })
  }

  correctLowerHeight() {
    const element = this.lowerRef.current
    if (!element || !element.children[0]) return

    const child = element.children[0]
    const rect = child.getBoundingClientRect()
    this.setState((prev) => {
      return { ...prev, lowerHeight: rect.height + 'px' }
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

          return <LGProvider logGroup={this.props.logGroup}>
            <VertBox className="log-group black-border c-white">
              <LGHead onClick={() => this.headClick()} open={this.state.open} groupName={this.props.logGroup.name}/>
              <div ref={this.lowerRef} className={cls('log-lower', 'c-black', !this.state.open && 'closed')}
                style={{ height: this.state.open ? undefined : '0' }}>
                <Box className="log-inner">
                  <RecordSheet logGroup={this.props.logGroup} />
                  <GroupMain/>
                </Box>
              </div>
            </VertBox>
          </LGProvider>
        }}
      </QueryComponent>
    )
  }
}
