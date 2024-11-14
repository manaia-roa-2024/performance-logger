import request from "superagent";
import LogGroup from "../../models/classes/LogGroup";
import LogRecord, { ILogRecord } from "../../models/classes/LogRecord";

export default function getLogRecords(logGroup: LogGroup){
  return request.get('/api/v1/logrecords?groupId=' + logGroup.id).then(res =>{
   const records = res.body.map((record: ILogRecord) =>{
    return LogRecord.Instance(record, logGroup)
   }) as LogRecord[]
   records.sort((a, b) =>{
    const d1 = new Date(a.date)
    const d2 = new Date(b.date)
    return d2.getTime() - d1.getTime()
   })
   logGroup.logRecords = records
   return records
  })
}