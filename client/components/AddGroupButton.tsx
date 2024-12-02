import { Component } from 'react'
import MutationComponent from './MutationComponent'
import addLogGroup from '../apis/addLogGroup'
import LogGroup, { ILogGroup } from '../../models/classes/LogGroup'
import { QueryClient } from '@tanstack/react-query'
import { Auth0Context, Auth0ContextInterface } from '@auth0/auth0-react'

export default class AddGroupButton extends Component {
  static contextType = Auth0Context
  context!: Auth0ContextInterface

  render() {

    const mutationFn = async () => addLogGroup({
      name: 'New Performance Group',
      metric: 'length',
      unit: 'M',
      groupBy: 'none',
      graphType: 'line',
      yStat: 'mean'
    }, await this.context.getAccessTokenSilently())

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
