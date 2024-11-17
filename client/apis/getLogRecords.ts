import request from "superagent";
import LogGroup from "../../models/classes/LogGroup";
import LogRecord, { ILogRecord } from "../../models/classes/LogRecord";

export default function getLogRecords(logGroup: LogGroup){

  return request.get('/api/v1/logrecords?groupId=' + logGroup.id).then(res =>{
   const records = res.body.map((record: ILogRecord) =>{
    return LogRecord.Instance(record, logGroup)
   }) as LogRecord[]
   records.sort(LogRecord.getSorter())
   logGroup.logRecords = records
   return Math.round(Math.random() * 1_000_000)
  })
}