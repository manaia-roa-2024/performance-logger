const formatText = function(text: string){
  return text.trim().replace(/\s+/g, " ")
}

const validDateRgx = /^\d{4}-\d{2}-\d{2}$/

function toISODate(date: Date){
  return date.toISOString().substring(0, 10)
}

function createTimeStamp(){
  return (new Date()).toISOString()
}
export default {formatText, validDateRgx, toISODate, createTimeStamp}