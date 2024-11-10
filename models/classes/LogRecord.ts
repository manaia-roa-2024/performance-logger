import Fields from "../Fields";
import LogGroup from "./LogGroup";

//nullable means db determined
export interface ILogRecord{
  id?: number
  value: number,
  date: string,
  created?: string 
}

export default class LogRecord implements ILogRecord{
  //db
  id?: number
  value: number
  date: string
  created?: string

  //entities
  logGroup?: LogGroup

  constructor(){
    this.id = undefined 
    this.value = 0
    this.date = '2024-11-03'
    this.created = undefined

    this.logGroup = undefined
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