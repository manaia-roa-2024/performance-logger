import express from 'express'
import * as Path from 'node:path'

import logRouter from './routes/logRouter.ts'
import errorHandler from './middleware/errorHandler.ts'
import BodyValidator from './middleware/BodyValidator.ts'

const server = express()

server.use(express.json())

server.use('/api/v1/', logRouter)

server.post('/test', BodyValidator.LogRecord, async (req, res) =>{
  res.status(200)
  res.send("Yippy I O")
})

server.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
