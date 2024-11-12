import { Component } from 'react'
import MutationComponent from './MutationComponent'
import addLogGroup from '../apis/addLogGroup'
import LogGroup, { ILogGroup } from '../../models/classes/LogGroup'
import { QueryClient } from '@tanstack/react-query'
import LogCollection from '../../models/classes/LogCollection'

export default class AddGroupButton extends Component {
  render() {

    const mutationFn = () => addLogGroup({
      name: 'New Performance Group',
      metric: 'length',
      unit: 'M'
    })

    const onSuccess = (newLogGroup: ILogGroup, queryClient: QueryClient) =>{
      queryClient.setQueryData(['log-collection'], (old: LogCollection) =>{
        const clone = LogCollection.Clone(old)
        clone.logGroups.splice(0, 0, LogGroup.Instance(newLogGroup, clone))
        return clone
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
