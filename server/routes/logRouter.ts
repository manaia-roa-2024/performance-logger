import { Router } from "express";

import * as db from '../db/dbUtil.ts'

const router = Router()

router.get('/loggroups', async (req, res) =>{
  const logGroups = await db.getAllGroups()
  res.json(logGroups)
})

router.get('/logrecords', async (req, res) =>{

  const logResults = await db.getAllRecords(Number(req.query.groupId))
  
  res.json(logResults)
  
})

export default router