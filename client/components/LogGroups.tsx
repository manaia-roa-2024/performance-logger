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
import getLogRecords from '../apis/getLogRecords'


export default class LogGroups extends QueryComponent {
  constructor(props: object){
    super(props, ['log-collection'], getLogCollection)
  }

  renderQuery({ data, isPending, isError }: UseQueryResult<LogCollection>): ReactNode {
    if (isPending)
      return <p>Pending...</p>

    if (isError || !data)
      return <p>There was an error loading your records</p>

    return <VertBox gap='40px'>
      {data.logGroups.map((group, index) =>{
        if (index > 1) return 
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
  logRecords: LogRecord[],
  logGroup: LogGroup
}

export const LogGroupContext = React.createContext<ILogGroupContext | undefined>(undefined)

class CLogGroup extends QueryComponent<Props, State>{

  lowerRef: RefObject<HTMLDivElement>

  constructor(props: Props){
    super(props, ['records', props.logGroup.id!.toString()], () => getLogRecords(props.logGroup))

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

  renderQuery({ data: logRecords, isPending, isError }: UseQueryResult<Array<LogRecord>>){

    if (isPending)
      return <p>Pending...</p>

    if (isError || !logRecords)
      return <p>There was an error loading your records</p>

    return(
    <LogGroupContext.Provider value={{correctHeightFn: () => this.correctLowerHeight(), reload: () => this.forceUpdate(), logRecords: logRecords, logGroup: this.props.logGroup}}>
      <VertBox className='log-group black-border c-white'>
        <Box className='log-group-head cp aic' onClick={() => this.headClick()}>
          <h4 className='fg1'>{this.props.logGroup.name}</h4>
          {this.state.open ? <Minus/> : <Expand/>}
        </Box>
        <div ref={this.lowerRef} className={cls('log-lower', 'c-black', !this.state.open && 'closed')} style={{height: this.state.open ? undefined : '0'}}>
          <Box className='log-inner'>
            <RecordSheet logRecords={logRecords}/>
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