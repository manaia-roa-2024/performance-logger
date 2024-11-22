import request from "superagent";
import { PartialLogGroup } from "../../models/classes/LogGroup";

export default function addLogGroup(logGroup: PartialLogGroup){
  return request.post('/api/v1/loggroups').send(logGroup).then(res =>{
    return res.body
  })
}