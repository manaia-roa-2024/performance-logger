import { Order } from "../Order";
import LogRecord, { ILogRecord } from "./LogRecord";
import { MetricHandler } from "./MetricHandler";

export interface PartialLogGroup{
  name: string
  metric: string
  unit: string
}

export interface ILogGroup extends PartialLogGroup{
  id: number
  created: string
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

/*

- Adding groups: create group from json, add to queryCache
- Removing group: Remove from cache, remove form form
- Updating group: update properties from json instead of creating new instance
- Adding record: Create record from json, add to group, add new cellinput
- Removing record: Remove record from group. Delete form input
- Updating record: update properties from json instead of creating new instance
*/

export default class LogGroup implements ILogGroup{
  //db
  id: number
  name: string
  metric: string;
  unit: string
  created: string

  // entities
  logRecords: LogRecord[]

  constructor(json: ILogGroup){
    this.id = json.id
    this.name =  json.name
    this.metric = json.metric
    this.unit = json.unit
    this.created = json.created
    
    this.logRecords = []
  }

  update(json: ILogGroup){
    this.id = json.id
    this.name =  json.name
    this.metric = json.metric
    this.unit = json.unit
    this.created = json.created
  }

  addJsonRecord(json: ILogRecord){
    const instance = new LogRecord(json, this)
    this.logRecords.push(instance)
    return instance
  }

  addJsonRecords(json: Array<ILogRecord>){
    json.forEach(record =>{
      this.addJsonRecord(record)
    })
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

  sortRecords(){
    return this.logRecords.sort(LogRecord.getSorter())
  }

  static getSorter(order: Order = "desc"){
    return function(a: {created?: string}, b: {created?: string}){
      const d1 = new Date(a.created!)
      const d2 = new Date(b.created!)
      return order === "asc" ? (d1.getTime() - d2.getTime()) : (d2.getTime() - d1.getTime())
    }
  }
}