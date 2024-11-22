import request from "superagent";
import LogGroup, { ILogGroup } from "../../models/classes/LogGroup";

export default function getLogCollection(){
  return request.get('/api/v1/loggroups').then(res =>{
      const body = res.body as ILogGroup[]
      return body.map<LogGroup>((json) =>{
        const logGroup = new LogGroup(json)
        return logGroup
      }).sort(LogGroup.getSorter())
  })
} 