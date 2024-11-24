import { Router } from "express"
import connection from "../db/connection"
import { ILogGroup } from "../../models/classes/LogGroup"
import { ILogRecord } from "../../models/classes/LogRecord"
import * as fs from 'node:fs/promises'

const snapshotRouter = Router()


type SnapGroup = ILogGroup & {logRecords: Array<ILogRecord>}
type Snapshot = Array<SnapGroup>

const snapshotPath = './server/snapshots'

async function createSnapshot(): Promise<Snapshot>{
  const groupMap = new Map<number, SnapGroup>()
  const snapshot: Snapshot = []
  const groups = await connection<ILogGroup>('logGroup')
  for (const group of groups){
    snapshot.push({
      ...group,
      logRecords: []
    })
    groupMap.set(group.id, snapshot[snapshot.length - 1])
  }

  const records = await connection<ILogRecord>('logRecord')
  for (const record of records){
    groupMap.get(record.logGroupId)?.logRecords.push(record)
  }

  const filePath = `${snapshotPath}/snapshot_${Date.now()}`

  await fs.writeFile(filePath, JSON.stringify(snapshot, null, 2))

  return snapshot
}

(async function(){
  const files = await fs.readdir(snapshotPath)
  if (files.length === 0){
    console.log("Creating snapshot")
    return createSnapshot()
  }

  const last = files.at(-1)!

  const now = Date.now()
  const snapTime = Number(last.substring(9))
  
  if ((now - snapTime) / 3_600_000 >= 24){
    console.log("Creating snapshot")
    createSnapshot()
  }
})()


snapshotRouter.get('/', async (req, res) =>{
  const snap = await createSnapshot()
  res.json(snap)
})

snapshotRouter.post('/', async (req, res) =>{
  const snapshot: Snapshot = req.body

  const freshids = Boolean(req.query.freshids === '1')
  console.log(freshids)

  for (const snapGroup of snapshot){
    const result = await connection('logGroup').insert({
      id: !freshids ? snapGroup.id : undefined,
      created: snapGroup.created,
      metric: snapGroup.metric,
      name: snapGroup.name,
      unit: snapGroup.unit
    }, 'id')

    console.log(result)

    await connection('logRecord').insert(snapGroup.logRecords.map(lr =>{
      return {
        value: lr.value,
        created: lr.created,
        logGroupId: result[0].id,
        date: lr.date
      }
    }))
  }

  res.sendStatus(200)
})

export default snapshotRouter