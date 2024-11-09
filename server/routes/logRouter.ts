import { Router } from "express";

import * as db from '../db/dbUtil.ts'

const router = Router()

router.get('/loggroups', async (req, res) =>{
  try {
    const logGroups = await db.getAllGroups()

    res.json(logGroups)
  } catch(error){
    console.log(error)
    res.sendStatus(500).send("Something went wrong")
  }
})

router.get('/logrecords/:id', async (req, res) =>{
  try{
    const logResults = await db.getAllRecords(Number(req.params.id))
    res.json(logResults)
  } catch (error){
    res.sendStatus(500).send("Something went wrong")
  }
})

export default router