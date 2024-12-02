import request from "superagent";
import { PartialLogRecord } from "../../models/classes/LogRecord";

export function addLogRecord(logRecord: PartialLogRecord, token: string){
  return request.post('/api/v1/logrecord').send(logRecord).set('Authorization', `Bearer ${token}`).then(res =>{
    return res.body
  })
}