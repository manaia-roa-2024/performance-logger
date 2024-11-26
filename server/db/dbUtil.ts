import { ILogGroup, PartialLogGroup } from '../../models/classes/LogGroup.ts'
import { ILogRecord, PartialLogRecord } from '../../models/classes/LogRecord.ts'
import connection from './connection.ts'
import Util from '../../Util.ts'
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

export async function addGroup(group: PartialLogGroup){
  const result = await connection('logGroup')
    .insert({
      name: group.name,
      metric: group.metric,
      unit: group.unit,
      created: Util.createTimeStamp()
    }, '*') as ILogGroup[]

  return result[0]
}

export async function editGroup(group: Optional<PartialLogGroup>, id: number){
  const result = await connection('logGroup')
    .update({...group}, '*')
    .where({id}) as ILogGroup[]
  if (result.length === 0)
    throw ProblemDetails.NullError('group')
  return result[0]
}

export async function deleteGroup(id: number){
  await connection('logGroup')
    .where({id}).delete()
}

export async function addRecord(record: PartialLogRecord){
  const result = await connection<ILogRecord>('logRecord')
    .insert({
      value: record.value,
      date: record.date,
      created: Util.createTimeStamp(),
      logGroupId: record.logGroupId
    }, '*')
  return result[0]
}
