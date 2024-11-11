import {ReactNode } from 'react'
import QueryComponent from '../QueryComponent'
import { UseQueryResult } from '@tanstack/react-query'
import { VertBox } from '../Box'
import LogCollection from '../../../models/classes/LogCollection'
import getLogCollection from '../../apis/getLogCollection'
import CLogGroup from './CLogGroup'

export default class LogGroupPanel extends QueryComponent {
  constructor(props: object) {
    super(props, ['log-collection'], getLogCollection)
  }

  renderQuery({
    data,
    isPending,
    isError,
  }: UseQueryResult<LogCollection>): ReactNode {
    if (isPending) return <p>Pending...</p>

    if (isError || !data) return <p>There was an error loading your records</p>

    return (
      <VertBox gap="40px">
        {data.logGroups.map((group, index) => {
          if (index > 1) return
          return <CLogGroup key={group.id} logGroup={group} />
        })}
      </VertBox>
    )
  }
}
