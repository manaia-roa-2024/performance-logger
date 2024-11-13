import { ILogGroup } from '../../models/classes/LogGroup.ts'
import { ILogRecord } from '../../models/classes/LogRecord.ts'
import connection from './connection.ts'
import Util from '../Util.ts'
import Optional from '../../models/Optional.ts'
import ProblemDetails from '../ProblemDetails.ts'

export async function getAllGroups(){
  const result = await connection<ILogGroup>('logGroup')
  return result
}

export async function getAllRecords(logGroupId: number){
  const result = await connection<ILogRecord>('logRecord')
    .where({logGroupId})
  return result
}

export async function addGroup(group: ILogGroup){
  const toAdd: ILogGroup = {
    name: group.name,
    metric: group.metric,
    unit: group.unit,
    created: Util.createTimeStamp()
  }

  const result = await connection('logGroup')
    .insert({
      name: group.name,
      metric: group.metric,
      unit: group.unit,
      created: Util.createTimeStamp()
    })
  toAdd.id = result[0]
  return toAdd
}

export async function editGroup(group: Optional<ILogGroup>, id: number){
  const result = await connection('logGroup')
    .update({...group}, '*')
    .where({id}) as ILogGroup[]
  if (result.length === 0)
    throw ProblemDetails.NullError('group')
  return result[0]
}
