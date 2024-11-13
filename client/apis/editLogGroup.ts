import request from "superagent";
import { ILogGroup } from "../../models/classes/LogGroup";
import Optional from "../../models/Optional";

export default function editLogGroup(logGroup: Optional<ILogGroup>, id: number){
  return request.patch('/api/v1/loggroups/' + id).send(logGroup).then(res =>{
    return res.body as ILogGroup
  })
}