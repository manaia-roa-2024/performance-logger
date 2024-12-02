import request from "superagent";
import { PartialLogGroup } from "../../models/classes/LogGroup";

export default function addLogGroup(logGroup: PartialLogGroup, token: string){
  return request.post('/api/v1/loggroups').send(logGroup).set('Authorization', `Bearer ${token}`).then(res =>{
    return res.body
  })
}