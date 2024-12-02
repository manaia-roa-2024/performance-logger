import request from "superagent";

export default function deleteLogGroup(id: number, token: string){
  return request.delete('/api/v1/loggroups/' + id).set('Authorization', `Bearer ${token}`).then(res =>{
    return res.body
  })
}