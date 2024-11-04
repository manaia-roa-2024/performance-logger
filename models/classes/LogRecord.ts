import Fields from "../Fields";
import LogGroup from "./LogGroup";

export default class LogRecord{
  id?: number
  logGroup?: LogGroup
  value: number
  date: string

  constructor(){
    this.logGroup = undefined
    this.value = 0
    this.date = '2024-11-03'
  }

  static Instance(json: Fields<LogRecord>, logGroup: LogGroup){
    const lr = new LogRecord()

    lr.id = json.id
    lr.value = json.value
    lr.date = json.date
    lr.logGroup = logGroup

    return lr
  }
}