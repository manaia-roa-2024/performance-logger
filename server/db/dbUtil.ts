import connection from './connection.ts'

export async function getAllGroups(){
  const result = await connection('logGroup')
  console.log(result)
  return result
}

export async function getAllRecords(logGroupId: number){
  const result = await connection('logRecord')
    .where({logGroupId})

  return result
}
