import Fields from "../Fields";
import LogCollection from "./LogCollection";
import LogRecord from "./LogRecord";

export default class LogGroup{
  id?: number
  logRecords: LogRecord[]
  logCollection?: LogCollection
  name: string

  constructor(){
    this.logRecords = []
    this.logCollection = undefined
    this.name = 'New Performance Log'
  }

  static Instance(json: Fields<LogGroup>, logCollection: LogCollection){
    const lg = new LogGroup()
    
    lg.id = json.id
    lg.name = json.name
    lg.logCollection = logCollection

    for (const record of json.logRecords){
      lg.logRecords.push(LogRecord.Instance(record, lg))
    }

    return lg
  }
}