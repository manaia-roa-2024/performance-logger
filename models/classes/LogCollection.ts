import Fields from "../Fields";
import LogGroup from "./LogGroup";

export default class LogCollection{
  id?: number
  logGroups: LogGroup[]

  constructor(){
    this.logGroups = []
  }

  addLogGroup(logGroup: LogGroup){
    this.logGroups.push(logGroup)
    logGroup.logCollection = this
  }

  static Instance(json: Fields<LogCollection>){
    const lc = new LogCollection()

    lc.id = json.id

    for (const logGroup of json.logGroups){
      lc.logGroups.push(LogGroup.Instance(logGroup, lc))
    }

    return lc
  }
}


