import request from "superagent";
import LogGroup, { ILogGroup } from "../../models/classes/LogGroup";

export default function getLogCollection(token: string){
  return request.get('/api/v1/loggroups').set('Authorization', `Bearer ${token}`).then(res =>{
      const body = res.body as ILogGroup[]
      return body.map<LogGroup>((json) =>{
        const logGroup = new LogGroup(json)
        return logGroup
      }).sort(LogGroup.getSorter())
  })
} 