import { createRef, ReactNode, RefObject } from 'react'
import QueryComponent from './QueryComponent'
import { UseQueryResult } from '@tanstack/react-query'
import { Box, VertBox } from './Box'
import React from 'react'
import LogGroup from '../../models/classes/LogGroup'
import LogCollection from '../../models/classes/LogCollection'
import getLogCollection from '../apis/getLogCollection'
import cls from './SimpleForm/cls'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faExpand, faMinus } from '@fortawesome/free-solid-svg-icons'
import RecordSheet from './RecordSheet'
import LogRecord from '../../models/classes/LogRecord'


export default class LogGroups extends QueryComponent {
  constructor(props: object){
    super(props, ['log-collection'], getLogCollection)
  }

  renderQuery({ data, isPending, isError }: UseQueryResult<LogCollection>): ReactNode {
    console.log(data)

    if (isPending)
      return <p>Pending...</p>

    if (isError || !data)
      return <p>An unexpected error has occurred :(</p>

    return <VertBox gap='40px'>
      {data.logGroups.map((group, index) =>{
        if (index > 0) return
        return <CLogGroup key={group.id} logGroup={group}/>
      })}
    </VertBox>
  }
}

interface Props{
  logGroup: LogGroup
}

interface State{
  open: boolean
  lowerHeight: string
}

export interface ILogGroupContext{
  correctHeightFn: () => void,
  reload: () => void,
  logRecords: LogRecord[]
}

export const LogGroupContext = React.createContext<ILogGroupContext | undefined>(undefined)

class CLogGroup extends React.Component<Props, State>{

  lowerRef: RefObject<HTMLDivElement>

  constructor(props: Props){
    super(props)

    this.state ={
      open: true,
      lowerHeight: '0'
    }

    this.lowerRef = createRef()
  }

  headClick(){

    this.setState((prev) =>{
      return {
        ...prev,
        open: !prev.open
      }
    })
  }

  correctLowerHeight(){
    const element = this.lowerRef.current
    if (!element || !element.children[0]) return

    const child = element.children[0]
    const rect = child.getBoundingClientRect()
    console.log('Correcting height')
    this.setState(prev =>{
      return {...prev, lowerHeight: rect.height + 'px'}
    })
  }

  componentDidMount(): void {
    //this.correctLowerHeight()
  }

  render(){
    return(
    <LogGroupContext.Provider value={{correctHeightFn: () => this.correctLowerHeight(), reload: () => this.forceUpdate(), logRecords: this.props.logGroup.logRecords}}>
      <VertBox className='log-group black-border c-white'>
        <Box className='log-group-head cp aic' onClick={() => this.headClick()}>
          <h4 className='fg1'>{this.props.logGroup.name}</h4>
          {this.state.open ? <Minus/> : <Expand/>}
        </Box>
        <div ref={this.lowerRef} className={cls('log-lower', 'c-black', !this.state.open && 'closed')} style={{height: this.state.open ? undefined : '0'}}>
          <Box className='log-inner'>
            <RecordSheet logRecords={this.props.logGroup.logRecords}/>
          </Box>   
        </div>
      </VertBox>
    </LogGroupContext.Provider>)
  }
}

function Expand(){
  return <FontAwesomeIcon icon={faExpand} fontSize='25px'/>
}

function Minus(){
  return <FontAwesomeIcon icon={faMinus} fontSize='25px'/>
}