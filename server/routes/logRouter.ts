import { Router } from "express";

import * as db from '../db/dbUtil.ts'
import BodyValidator from "../middleware/BodyValidator.ts";
import connection from "../db/connection.ts";

const router = Router()

router.get('/loggroups', async (req, res) =>{
  const logGroups = await db.getAllGroups()
  res.json(logGroups)
})

router.post('/loggroups', BodyValidator.LogGroup, async (req, res) =>{
  const result = await db.addGroup(req.body)

  res.status(201).json(result)
})

router.patch('/loggroups/:id', BodyValidator.EditLogGroup, async (req, res) =>{
  const result = await db.editGroup(req.body, Number(req.params.id))
  res.json(result)
})

router.delete('/loggroups/:id', async (req, res) =>{
  await db.deleteGroup(Number(req.params.id))
  res.sendStatus(200)
})

router.get('/logrecords', async (req, res) =>{

  const logResults = await db.getAllRecords(Number(req.query.groupId))
  
  res.status(201).json(logResults)
})

router.post('/logrecord', BodyValidator.LogRecord, async (req, res) =>{
  const result = await db.addRecord(req.body)
  return res.json(result)
})

router.delete('/logrecord/:id', async (req, res) =>{
  await connection('logRecord')
    .where({id: req.params.id})
    .delete()
  
  res.sendStatus(201)
})




export default router