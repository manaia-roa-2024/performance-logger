import request from "superagent";
import { ILogGroup, PartialLogGroup } from "../../models/classes/LogGroup";
import Optional from "../../models/Optional";

export default function editLogGroup(logGroup: Optional<PartialLogGroup>, id: number, token: string){
  return request.patch('/api/v1/loggroups/' + id).send(logGroup).set('Authorization', `Bearer ${token}`).then(res =>{
    return res.body as ILogGroup
  })
}