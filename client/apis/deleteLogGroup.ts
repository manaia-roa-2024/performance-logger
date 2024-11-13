import request from "superagent";

export default function deleteLogGroup(id: number){
  return request.delete('/api/v1/loggroups/' + id).then(res =>{
    return res.body
  })
}