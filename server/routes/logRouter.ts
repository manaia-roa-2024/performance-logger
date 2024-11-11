import { Router } from "express";

import * as db from '../db/dbUtil.ts'
import BodyValidator from "../middleware/BodyValidator.ts";

const router = Router()

router.get('/loggroups', async (req, res) =>{
  const logGroups = await db.getAllGroups()
  res.json(logGroups)
})

router.get('/logrecords', async (req, res) =>{

  const logResults = await db.getAllRecords(Number(req.query.groupId))
  
  res.json(logResults)
  
})

router.post('/loggroups', BodyValidator.LogGroup, async (req, res) =>{
  const result = await db.addGroup(req.body)

  res.status(201).json(result)
})

export default router