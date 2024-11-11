import request from "superagent";
import LogGroup from "../../models/classes/LogGroup";
import LogRecord, { ILogRecord } from "../../models/classes/LogRecord";

export default function getLogRecords(logGroup: LogGroup){
  return request.get('/api/v1/logrecords?groupId=' + logGroup.id).then(res =>{
   return res.body.slice(0, 49).map((record: ILogRecord) =>{
    return LogRecord.Instance(record, logGroup)
   })
  })
}