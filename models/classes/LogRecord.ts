import { Order } from "../Order";
import LogGroup from "./LogGroup";
import { MetricHandler } from "./MetricHandler";

//nullable means db determined
export interface ILogRecord{
  id?: number
  value: number,
  date: string,
  created?: string 
  logGroupId: number
}

export default class LogRecord implements ILogRecord{
  //db
  id?: number
  value: number
  date: string
  created?: string
  logGroupId: number

  //entities
  logGroup?: LogGroup

  constructor(logGroupId: number){
    this.id = undefined 
    this.value = 0
    this.date = '2024-11-03'
    this.created = undefined
    this.logGroupId = logGroupId

    this.logGroup = undefined
  }

  getConvertedValue(): string{
    return MetricHandler.convertFromBase(this.logGroup!.metric, this.logGroup!.unit, this.value) || ''
  }

  static Instance(json: ILogRecord, logGroup: LogGroup){
    const lr = new LogRecord(logGroup.id!)

    lr.id = json.id
    lr.value = json.value
    lr.date = json.date
    lr.logGroup = logGroup

    return lr
  }

  static getSorter(order: Order = "desc"){
    return function(a: {date: string}, b: {date: string}){
      const d1 = new Date(a.date)
      const d2 = new Date(b.date)
      return order === "asc" ? (d1.getTime() - d2.getTime()) : (d2.getTime() - d1.getTime())
    }
  }
}