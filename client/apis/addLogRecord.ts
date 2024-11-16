import request from "superagent";
import { ILogRecord } from "../../models/classes/LogRecord";

export function addLogRecord(logRecord: ILogRecord){
  return request.post('/api/v1/logrecord').send(logRecord).then(res =>{
    return res.body
  })
}