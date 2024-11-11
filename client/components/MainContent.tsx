import { Children, Component, ReactNode } from 'react'
import { VertBox } from './Box'
import ContentChild from './ContentChild'
import LogGroups from './LogGroups/LogGroupPanel'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import LogGroup, { ILogGroup } from '../../models/classes/LogGroup'
import addLogGroup from '../apis/addLogGroup'
import LogCollection from '../../models/classes/LogCollection'

interface MutationProps{
  children: (mutationResult: UseMutationResult<any, Error, void, unknown>) => ReactNode
}

function MutationComponent(props: MutationProps){
  const queryClient = useQueryClient()

  const lg: ILogGroup = {
    name: 'New Performance Group',
    metric: 'length',
    unit: 'M'
  }

  const mutation = useMutation<ILogGroup>({
    mutationFn: () => addLogGroup(lg),
    onSuccess(newLogGroup, variables, context) {
      queryClient.setQueryData(['log-collection'], (old: LogCollection) =>{
        const clone = LogCollection.Clone(old)
        clone.logGroups.splice(0, 0, LogGroup.Instance(newLogGroup, clone))
        return clone
      })
    },
  })

  return props.children(mutation)
}

export default class MainContent extends Component {
  render() {
    return (
      <VertBox
        tag="section"
        className="aic main-content main-height"
        gap="50px"
      >
        <ContentChild className="simple-center mc-header">
          <h1>Track your performance</h1>
        </ContentChild>
        <VertBox gap="40px">
          <ContentChild>
            <VertBox gap="15px">
              <MutationComponent>
                {({mutate}) =>{
                  return <button onClick={() => mutate()} className="green-button fs2 cp">Add New Group</button>
                }}
              </MutationComponent>
              <div className="separator"></div>
            </VertBox>
          </ContentChild>
          <ContentChild>
            <LogGroups />
          </ContentChild>
        </VertBox>
      </VertBox>
    )
  }
}
