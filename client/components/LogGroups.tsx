import { ReactNode } from 'react'
import QueryComponent from './QueryComponent'
import { UseQueryResult } from '@tanstack/react-query'
import { VertBox } from './Box'
import React from 'react'
import LogGroup from '../../models/classes/LogGroup'
import LogCollection from '../../models/classes/LogCollection'
import getLogCollection from '../apis/getLogCollection'

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
      {data.logGroups.map(group =>{
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
}

class CLogGroup extends React.Component<Props, State>{

  constructor(props: Props){
    super(props)

    this.state ={
      open: true
    }
  }

  headClick(){

    this.setState((prev) =>{
      return {
        ...prev,
        open: !prev.open
      }
    })
  }

  render(){
    console.log(this.state)
    return <VertBox className='log-group black-border c-white'>
      <div className='log-group-head cp' onClick={() => this.headClick()}>
        <h4>{this.props.logGroup.name}</h4>
      </div>
    </VertBox>
  }
}