import { format } from "date-fns";
import Util from "../../Util";
import { Order } from "../Order";
import LogRecord, { ILogRecord } from "./LogRecord";
import { MetricHandler } from "./MetricHandler";
import roundToX from "../../client/roundToX";

export type GroupBy = 'none' | 'week' | 'month'

export interface PartialLogGroup{
  name: string
  metric: string
  unit: string
  groupBy: GroupBy
  graphType: 'line' | 'column'
  yStat: YStat
}

export interface ILogGroup extends PartialLogGroup{
  id: number
  created: string
}

export interface RecordStats{
  records: number
  mean: number | null
  median: number | null
  max: number | null
  min: number | null
  total: number | null
  [key: string]: number | null
}

export interface GroupPeriod{
  records: number
  mean: number
  median: number
  max: number
  min: number
  total: number
  //dateEnd: string
}

type AllString<T> = {
  [key in keyof T]: string
}

export type YStat = 'records' | 'mean' | 'median' | 'max' | 'min' | 'total'

export type GroupStats = RecordStats &{
  dateStart: string
  dateEnd: string
}

export interface GroupStatsMapValue{
  alias: string,
  yLabel: string
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
  static GroupByOptions = new Set<string>(['none', 'week', 'month'])
  static GraphTypes = new Set(['line', 'column'])
  static UnitBlacklist = new Set(['unit', 'duration'])
  static GroupStats = new Map<string, GroupStatsMapValue>([
    ['records', {alias: "Records", yLabel: '{P} Records'}], 
    ['mean', {alias: "Average", yLabel: 'Average {P} {L}'}],
    ['median', {alias: "Median", yLabel: 'Median {P} {L}'}],
    ['max', {alias: "Max", yLabel: 'Max {P} {L}'}],
    ['min', {alias: "Min", yLabel: 'Min {P} {L}'}],
    ['total', {alias: "Total", yLabel: 'Total {P} {L}'}]
  ])
  //db
  id: number
  name: string
  metric: string;
  unit: string
  created: string
  groupBy: GroupBy;
  graphType: "line" | "column"
  yStat: YStat

  // entities
  logRecords: LogRecord[]

  constructor(json: ILogGroup){
    this.id = json.id
    this.name =  json.name
    this.metric = json.metric
    this.unit = json.unit
    this.created = json.created
    this.groupBy = json.groupBy
    this.graphType = json.graphType
    this.yStat = json.yStat
    
    this.logRecords = []
  }

  update(json: ILogGroup){
    this.id = json.id
    this.name =  json.name
    this.metric = json.metric
    this.unit = json.unit
    this.created = json.created
    this.groupBy = json.groupBy
    this.graphType = json.graphType
    this.yStat = json.yStat
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
    return this.getStatsOfGroup(this.logRecords).formattedStats
  }

  getStatsOfGroup(records: Array<LogRecord>){
    const values = records.map(lr => lr.value).sort((a, b) => a - b)

    let median: null | number
    if (values.length === 0)
      median = null
    else if (values.length % 2 === 0)
      median = 0.5 * (values[values.length / 2] + values[values.length / 2 - 1])
    else
      median = values[Math.floor(values.length / 2)]

    const total = values.reduce((prev, cur) => prev + cur, 0)
      
    const preliminary = {
      min: values[0],
      max: values[values.length - 1],
      median,
      mean: values.length === 0 ? null : total / values.length,
      records: values.length,
      total
    } as RecordStats

    const formattedStats: AllString<RecordStats> = {
      min: '',
      max: '',
      median: '',
      mean: '',
      records: '',
      total: ''
    }

    for (const key in preliminary){
      const value = preliminary[key]
      if (key === 'records'){
        formattedStats.records = value!.toString()
        continue
      } else if (value == null){
        formattedStats[key] = 'N/A'
        continue
      }
      formattedStats[key] = this.getConvertedValueBlacklist(value)
    }
    return {formattedStats, rawStats: preliminary}
  }

  getPeriodStart(isoDate: string){
    return this.groupBy === 'week' ? Util.toISODate(Util.getWeekStart(Util.fromISO(isoDate))) : Util.toISODate(Util.getMonthStart(Util.fromISO(isoDate)))
  }

  getPeriodEnd(isoDate: string){
    return this.groupBy === 'week' ? Util.toISODate(Util.getWeekEnd(Util.fromISO(isoDate))) : Util.toISODate(Util.getMonthEnd(Util.fromISO(isoDate)))
  }

  getGroupData(){ // Method depends on records being sorted by date in descending order
    //const groups = new Map<string, GroupPeriod>()
    const allStats: Array<GroupStats> = []

    const groupIndexes: Array<number> = []

    let lastPeriodStart: string | null = null
    for (let i = this.logRecords.length - 1; i >= 0; i--){
      const record = this.logRecords[i]
      const periodStart = this.getPeriodStart(record.date)
      if (periodStart != lastPeriodStart){
        lastPeriodStart = periodStart
        groupIndexes.push(i)
      }
    }

    for (let i = groupIndexes.length - 1; i >= 0; i--){
      const groupArr = this.logRecords.slice((groupIndexes[i+1] ?? -1) + 1, groupIndexes[i] + 1)
      const {rawStats} = this.getStatsOfGroup(groupArr)

      const rs = rawStats as GroupStats
      rs.dateStart = this.getPeriodStart(groupArr[0].date)
      rs.dateEnd = this.getPeriodEnd(groupArr[0].date)
      allStats.push(rs)
    }

   return allStats
  }

  formId(){
    return 'record-sheet-' + this.id
  }

  isDuration(){
    return this.unit === 'duration'
  }

  isTime(){
    return this.metric === 'time'
  }

  convertGraphValue(graphValue: number): string | number | null{ // value to display on graph instead of actual value
    switch (this.unit){
      case 'duration':
        return MetricHandler.convertFromBase(this.metric, this.unit, graphValue)
    }
    return roundToX(graphValue, 4)
  }

  sortRecords(){
    return this.logRecords.sort(LogRecord.getSorter())
  }

  getConvertedValue(value: number, includeSuffix = false){
    return includeSuffix ? this.getConvertedValueWithUnit(value) : MetricHandler.convertFromBase(this.metric, this.unit, value)
  }

  getConvertedValueWithUnit(value: number){
    switch (this.unit){
      case '$':{
        const sym = value < 0 ? '-' : ''
        return sym + '$' + MetricHandler.convertFromBase(this.metric, this.unit, Math.abs(value))
      }
    }
    return MetricHandler.convertFromBase(this.metric, this.unit, value) + ' ' + MetricHandler.getCode(this.metric, this.unit)
  }

  getConvertedValueBlacklist(value: number){
    return this.getConvertedValue(value, !LogGroup.UnitBlacklist.has(this.unit))
  }

  getLineGraphValue(value: number): number{ //real value to feed into graph,
    const unit = this.unit
    switch (unit){
      case 'duration':
        return Math.abs(value)
    }
    return Number(this.getConvertedValue(value))
  }

  getYLabel(): string | undefined{
    if (this.unit === 'unit')
      return ''
    else if (this.unit === '$')
      return 'Dollars ($)'

    return (`${MetricHandler.getMetricAlias(this.metric)} (${MetricHandler.getCode(this.metric, this.unit)})`)
  }

  static getSorter(order: Order = "desc"){
    return function(a: {created?: string}, b: {created?: string}){
      const d1 = new Date(a.created!)
      const d2 = new Date(b.created!)
      return order === "asc" ? (d1.getTime() - d2.getTime()) : (d2.getTime() - d1.getTime())
    }
  }

  static standardDate(date: Date | string){
    let da: Date
    if (typeof(date) === 'string')
      da = new Date(date)
    else
      da = date

    return format(da, 'dd-MM-yyyy')
  }
}