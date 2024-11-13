import { Router } from "express";

import * as db from '../db/dbUtil.ts'
import BodyValidator from "../middleware/BodyValidator.ts";

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

router.get('/logrecords', async (req, res) =>{

  const logResults = await db.getAllRecords(Number(req.query.groupId))
  
  res.json(logResults)
  
})



export default router