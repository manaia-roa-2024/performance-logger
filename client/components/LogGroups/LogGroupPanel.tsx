import {Component, ReactNode } from 'react'
import QueryComponent from '../QueryComponent'
import { VertBox } from '../Box'
import getLogCollection from '../../apis/getLogCollection'
import CLogGroup from './CLogGroup'

export default class LogGroupPanel extends Component{
  constructor(props: object) {
    super(props)
  }

  render(): ReactNode {
    return (
      <QueryComponent queryKey={['all-log-groups']} queryFn={getLogCollection}>
        {
          ({data: logGroups, isPending, isError}) =>{
            
            if (isPending) return <p>Pending...</p>

            if (isError || !logGroups) return <p>There was an error loading your records</p>

            if (logGroups.length === 0)
              return <VertBox className='fg1 aic' gap='5px'>
                <p>There are no performance groups at the moment</p>
                <p>Click {'"Add New Group"'} to begin</p>
              </VertBox>

            return <VertBox gap="40px">
              {logGroups.map((group) => {
                return <CLogGroup key={group.id} logGroup={group} />
              })}
              {/*<FormLogger/>*/}
            </VertBox>
          }
          
        }
      </QueryComponent>
      
    )
  }
}
