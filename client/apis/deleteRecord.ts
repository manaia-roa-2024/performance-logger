import request from "superagent";

export default function deleteRecord(id: number, token: string){
  return request.delete('/api/v1/logrecord/' + id).set('Authorization', `Bearer ${token}`).then(() => id)
}