import LogGroup, { ILogGroup } from "./LogGroup";

export default class LogCollection{
  logGroups: LogGroup[]

  constructor(){
    this.logGroups = []
  }

  addLogGroup(logGroup: LogGroup){
    this.logGroups.push(logGroup)
    logGroup.logCollection = this
  }

  static Instance(logGroups: Array<ILogGroup>){
    const collection = new LogCollection()
    for (const lg of logGroups){
      collection.addLogGroup(LogGroup.Instance(lg, collection))
    }
    return collection
  }

  static Clone(oldCollection: LogCollection){
    const lc = new LogCollection()
    lc.logGroups = oldCollection.logGroups
    for (const lg of oldCollection.logGroups){
      lg.logCollection = lc
    }
    return lc
  }
}


