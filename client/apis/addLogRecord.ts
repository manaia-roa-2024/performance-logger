import request from "superagent";
import { PartialLogRecord } from "../../models/classes/LogRecord";

export function addLogRecord(logRecord: PartialLogRecord){
  return request.post('/api/v1/logrecord').send(logRecord).then(res =>{
    return res.body
  })
}