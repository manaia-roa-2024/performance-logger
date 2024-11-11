import request from "superagent";
import LogCollection from "../../models/classes/LogCollection";

export default function getLogCollection(){
  return request.get('/api/v1/loggroups').then(res =>{
      return LogCollection.Instance(res.body)
  })
} 