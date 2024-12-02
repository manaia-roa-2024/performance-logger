import { ILogGroup, PartialLogGroup } from '../../models/classes/LogGroup.ts'
import { ILogRecord, PartialLogRecord } from '../../models/classes/LogRecord.ts'
import connection from './connection.ts'
import Util from '../../Util.ts'
import Optional from '../../models/Optional.ts'
import ProblemDetails from '../ProblemDetails.ts'

export async function getAllGroups(auth0sub: string){
  const result = await connection<ILogGroup>('logGroup').where('auth0sub', auth0sub)
  return result
}

export async function getAllRecords(logGroupId: number){
  const result = await connection<ILogRecord>('logRecord')
    .where({logGroupId})
  return result
}

export async function addGroup(group: PartialLogGroup, auth0sub: string){
  const result = await connection('logGroup')
    .insert({
      name: group.name,
      metric: group.metric,
      unit: group.unit,
      created: Util.createTimeStamp(),
      auth0sub
    }, '*') as ILogGroup[]

  return result[0]
}

export async function editGroup(group: Optional<PartialLogGroup>, id: number, auth0sub: string){
  const result = await connection('logGroup')
    .update({...group}, '*')
    .where({id}).andWhere('auth0sub', auth0sub) as ILogGroup[]
  if (result.length === 0)
    throw ProblemDetails.NullError('group')
  return result[0]
}

export async function deleteGroup(id: number, auth0sub: string){
  await connection('logGroup')
    .where({id}).andWhere('auth0sub', auth0sub).delete()
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

export async function verifyGroupPermission(id: number, auth0sub: string){
  const result = await connection('logGroup').where({id}).andWhere('auth0sub', auth0sub)

  console.log(result)
  if (result.length === 0)
    throw ProblemDetails.PermissionError()
}

export async function verifyRecordPermission(id: number, auth0sub: string){
  const result = await connection('logRecord')
    .join('logGroup', 'logGroup.id', 'logRecord.logGroupId')
    .where('logGroup.auth0sub', auth0sub)

  console.log(result)
  if (result.length === 0)
    throw ProblemDetails.PermissionError()
}
