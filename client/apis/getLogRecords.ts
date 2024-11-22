import request from "superagent";
import LogGroup from "../../models/classes/LogGroup";
import { ILogRecord } from "../../models/classes/LogRecord";

export default function getLogRecords(group: LogGroup){

  return request.get('/api/v1/logrecords?groupId=' + group.id).then(res =>{
    const jsonRecords: Array<ILogRecord> = res.body
    group.addJsonRecords(jsonRecords)
    group.sortRecords()
    return Math.round(Math.random() * 1_000_000)
  })
}