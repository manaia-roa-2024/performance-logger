import getDateSorter from "../../client/dateSorter";
import LogCollection from "./LogCollection";
import LogRecord, { ILogRecord } from "./LogRecord";

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

  setRecords(records: Array<LogRecord>){
    this.logRecords = records
    for (const rec of records){
      rec.logGroup = this
    }
  }

  addRecordFromJson(record: ILogRecord){
    const instance = LogRecord.Instance(record, this)
    this.logRecords.push(instance)
    this.logRecords.sort(getDateSorter(false))
    return instance
  }

  removeById(id: number){
    const index = this.logRecords.findIndex(x => x.id === id)
    if (index >= 0){
      console.log("REMOVING ID NUMBER", id)
      this.logRecords.splice(index, 1)
    }
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