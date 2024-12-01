import { Component } from 'react'
import MutationComponent from './MutationComponent'
import addLogGroup from '../apis/addLogGroup'
import LogGroup, { ILogGroup } from '../../models/classes/LogGroup'
import { QueryClient } from '@tanstack/react-query'

export default class AddGroupButton extends Component {
  render() {

    const mutationFn = () => addLogGroup({
      name: 'New Performance Group',
      metric: 'length',
      unit: 'M',
      groupBy: 'none',
      graphType: 'line',
      yStat: 'mean'
    })

    const onSuccess = (json: ILogGroup, queryClient: QueryClient) =>{
      queryClient.setQueryData(['all-log-groups'], (old: Array<LogGroup>) =>{
        const newGroup = new LogGroup(json)
        const sorted = [...old, newGroup].sort(LogGroup.getSorter())
        return sorted
      })
    }

    return (
      <MutationComponent mutationFn={mutationFn} onSuccess={onSuccess}>
        {({mutate}) =>{
          return <button onClick={() => mutate()} className="green-button fs2 cp">Add New Group</button>
        }}
      </MutationComponent>
    )
  }
}
