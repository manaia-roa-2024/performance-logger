import { Order } from "../Order";
import LogGroup from "./LogGroup";
import { MetricHandler } from "./MetricHandler";

//nullable means db determined
export interface PartialLogRecord{
  value: number
  date: string
  logGroupId: number
}

export interface ILogRecord extends PartialLogRecord{
  id: number
  created: string 
}

export default class LogRecord implements ILogRecord{
  //db
  id: number
  value: number
  date: string
  created: string
  logGroupId: number

  //entities
  logGroup: LogGroup

  constructor(record: ILogRecord, group: LogGroup){
    this.id = record.id 
    this.value = record.value
    this.date = record.date
    this.created = record.created
    this.logGroupId = record.logGroupId

    this.logGroup = group
  }

  update(record: ILogRecord){
    this.id = record.id 
    this.value = record.value
    this.date = record.date
    this.created = record.created
    this.logGroupId = record.logGroupId
  }

  getConvertedValue(): string{
    return MetricHandler.convertFromBase(this.logGroup.metric, this.logGroup.unit, this.value)
  }

  getLineGraphValue(): number{
    //const metric = this.logGroup.metric
    const unit = this.logGroup.unit
    switch (unit){
      case 'duration':
        return Math.abs(this.value)
    }
    return Number(this.getConvertedValue())
  }

  getInputId(): string{
    return 'record-input-' + this.id
  }

  static getSorter(order: Order = "desc"){
    return function(a: {date: string}, b: {date: string}){
      const d1 = new Date(a.date)
      const d2 = new Date(b.date)
      return order === "asc" ? (d1.getTime() - d2.getTime()) : (d2.getTime() - d1.getTime())
    }
  }
}