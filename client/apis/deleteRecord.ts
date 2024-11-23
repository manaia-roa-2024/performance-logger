import request from "superagent";

export default function deleteRecord(id: number){
  return request.delete('/api/v1/logrecord/' + id).then(() => id)
}