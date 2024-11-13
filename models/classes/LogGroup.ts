import LogCollection from "./LogCollection";
import LogRecord from "./LogRecord";

//nullable means db determined
export interface ILogGroup{
  id?: number
  name: string
  created?: string
  metric: string,
  unit: string
}

export default class LogGroup implements ILogGroup{
  //db
  id?: number
  name: string
  metric: string;
  unit: string
  created?: string

  // entities
  logRecords: LogRecord[]
  logCollection?: LogCollection

  constructor(){
    this.id = undefined
    this.name = 'New Performance Log'
    this.metric = ''
    this.unit = ''
    this.created = undefined

    this.logRecords = []
    this.logCollection = undefined
  }

  formId(){
    return 'record-sheet-' + this.id
  }

  static Instance(json: ILogGroup, logCollection: LogCollection){
    const lg = new LogGroup()
    
    lg.id = json.id
    lg.name = json.name
    lg.logCollection = logCollection
    lg.metric = json.metric
    lg.unit = json.unit

    return lg
  }
}