import { ILogGroup } from '../../models/classes/LogGroup.ts'
import { ILogRecord } from '../../models/classes/LogRecord.ts'
import connection from './connection.ts'

export async function getAllGroups(){
  const result = await connection<ILogGroup>('logGroup')
  return result
}

export async function getAllRecords(logGroupId: number){
  const result = await connection<ILogRecord>('logRecords')
    .where({logGroupId})
  return result
}
