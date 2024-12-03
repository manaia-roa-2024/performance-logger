import express from 'express'
import * as Path from 'node:path'

import logRouter from './routes/logRouter.ts'
import errorHandler from './middleware/errorHandler.ts'
import BodyValidator from './middleware/BodyValidator.ts'
import { seed } from './db/seeds/logGroups.js'
import connection from './db/connection.ts'
//import snapshotRouter from './routes/snapshotRouter.ts'
import Auth from './middleware/Auth.ts'

const server = express()

server.use(express.json())
server.use('/api/v1/', Auth.checkJwt)
server.use('/api/v1/', logRouter)
//server.use('/api/v1/snapshots', snapshotRouter)

server.post('/test', BodyValidator.CreateLogGroup, async (req, res) =>{
  res.status(200)
  res.send("Yippy I O")
})

server.post('/api/v1/reset', async (req, res) =>{
  if (req.body.password !== 'perf-log-123') res.status(403).send("No")
  await seed(connection)
  res.send("DB Reset")
})

server.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*wildcard', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
