import request from "superagent";
import { ILogGroup, PartialLogGroup } from "../../models/classes/LogGroup";
import Optional from "../../models/Optional";

export default function editLogGroup(logGroup: Optional<PartialLogGroup>, id: number){
  return request.patch('/api/v1/loggroups/' + id).send(logGroup).then(res =>{
    return res.body as ILogGroup
  })
}