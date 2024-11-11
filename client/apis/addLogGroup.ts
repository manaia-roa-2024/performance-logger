import request from "superagent";
import { ILogGroup } from "../../models/classes/LogGroup";

export default function addLogGroup(logGroup: ILogGroup){
  return request.post('/api/v1/loggroups').send(logGroup).then(res =>{
    return res.body
  })
}