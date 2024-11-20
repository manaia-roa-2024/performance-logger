import { Order } from "../Order";
import LogCollection from "./LogCollection";
import LogRecord, { ILogRecord } from "./LogRecord";
import { MetricHandler } from "./MetricHandler";

//nullable means db determined
export interface ILogGroup{
  id?: number
  name: string
  created?: string
  metric: string,
  unit: string
}

export interface RecordStats{
  records: number
  mean: number | 'N/A',
  median: number | 'N/A',
  max: number | 'N/A',
  min: number | 'N/A',
  [key: string]: number | 'N/A'
}

type AllString<T> = {
  [key in keyof T]: string
}

export default class LogGroup implements ILogGroup{
  //db
  id?: number
  name: string
  metric: string;
  unit: string
  created?: string

  arand: number

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

    this.arand = Math.random()
  }

  getAnalytics(): AllString<RecordStats>{
    const values = this.logRecords.map(lr => lr.value).sort((a, b) => a - b)

    let median: 'N/A' | number
    if (values.length === 0)
      median = 'N/A'
    else if (values.length % 2 === 0)
      median = 0.5 * (values[values.length / 2] + values[values.length / 2 - 1])
    else
      median = values[Math.floor(values.length / 2)]

    const total = values.reduce((prev, cur) => prev + cur, 0)
      
    const preliminary = {
      min: values[0] || 'N/A',
      max: values[values.length - 1] || 'N/A',
      median,
      mean: values.length === 0 ? 'N/A' : total / values.length,
      records: values.length
    } as RecordStats

    const finalStats: AllString<RecordStats> = {
      min: 'N/A',
      max: 'N/A',
      median: 'N/A',
      mean: 'N/A',
      records: 'N/A'
    }

    const hideUnits = new Set(['unit', 'duration'])

    for (const key in preliminary){
      const value = preliminary[key]
      if (key === 'records' || value === 'N/A'){
        finalStats[key] = value.toString()
        continue
      }
      finalStats[key] = MetricHandler.convertFromBase(this.metric, this.unit, value)! + ' ' + (hideUnits.has(this.unit) ? '' : MetricHandler.getCode(this.metric, this.unit))
    }
    return finalStats
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
    this.logRecords.sort(LogRecord.getSorter())
    return instance
  }

  removeById(id: number){
    const index = this.logRecords.findIndex(x => x.id === id)
    if (index >= 0){
      console.log("REMOVING ID NUMBER", id)
      this.logRecords.splice(index, 1)
    }
  }

  isDuration(){
    return this.unit === 'duration'
  }

  convertGraphValue(graphValue: number): string | number | null{
    switch (this.unit){
      case 'duration':
        return MetricHandler.convertFromBase(this.metric, this.unit, graphValue)
    }
    return graphValue
  }

  static Instance(json: ILogGroup, logCollection: LogCollection){
    const lg = new LogGroup()
    
    lg.id = json.id
    lg.name = json.name
    lg.logCollection = logCollection
    lg.metric = json.metric
    lg.unit = json.unit
    lg.created = json.created

    return lg
  }

  static getSorter(order: Order = "desc"){
    return function(a: {created?: string}, b: {created?: string}){
      const d1 = new Date(a.created!)
      const d2 = new Date(b.created!)
      return order === "asc" ? (d1.getTime() - d2.getTime()) : (d2.getTime() - d1.getTime())
    }
  }
}