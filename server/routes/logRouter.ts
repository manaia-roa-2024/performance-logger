import { Request, Router } from "express";

import * as db from '../db/dbUtil.ts'
import BodyValidator from "../middleware/BodyValidator.ts";
import connection from "../db/connection.ts";
import { ILogRecord } from "../../models/classes/LogRecord.ts";
import ProblemDetails from "../ProblemDetails.ts";

const router = Router()

interface AuthRequest extends Request{
  auth?: {sub: string}
}

router.get('/loggroups', async (req: AuthRequest, res) =>{
  const logGroups = await db.getAllGroups(req.auth!.sub)
  res.json(logGroups)
})

router.post('/loggroups', BodyValidator.CreateLogGroup, async (req: AuthRequest, res) =>{
  const result = await db.addGroup(req.body, req.auth!.sub)

  res.status(201).json(result)
})

router.patch('/loggroups/:id', BodyValidator.EditLogGroup, async (req: AuthRequest, res) =>{
  const result = await db.editGroup(req.body, Number(req.params.id), req.auth!.sub)
  res.json(result)
})

router.delete('/loggroups/:id', async (req: AuthRequest, res) =>{
  await db.deleteGroup(Number(req.params.id), req.auth!.sub)
  res.sendStatus(200)
})

router.get('/logrecords', async (req: AuthRequest, res) =>{
  await db.verifyGroupPermission(Number(req.query.groupId), req.auth!.sub)

  const logResults = await db.getAllRecords(Number(req.query.groupId))
  
  res.status(201).json(logResults)
})

router.post('/logrecord', BodyValidator.CreateLogRecord, async (req: AuthRequest, res) =>{
  await db.verifyGroupPermission(req.body.logGroupId, req.auth!.sub)
  const result = await db.addRecord(req.body)
  return res.json(result)
})

router.delete('/logrecord/:id', async (req: AuthRequest, res) =>{
  await db.verifyRecordPermission(Number(req.params.id), req.auth!.sub)
  await connection('logRecord')
    .where({id: req.params.id})
    .delete()
  
  res.sendStatus(201)
})

router.patch('/logrecord/:id', BodyValidator.EditLogRecord, async (req: AuthRequest, res) =>{
  await db.verifyRecordPermission(Number(req.params.id), req.auth!.sub)
  const record = await connection('logRecord')
    .update({...req.body}, '*')
    .where({id: req.params.id}) as Array<ILogRecord>
  
  if (record.length != 1)
    throw ProblemDetails.NullError('record')

  res.json(record[0])
})

/*router.delete('/deleteall', async (req, res) =>{
  if (req.body.password !== 'perf-log-123') res.status(403).send("No")
  await connection('logRecord').delete()
  await connection('logGroup').delete()
  res.sendStatus(200)
})*/


export default router