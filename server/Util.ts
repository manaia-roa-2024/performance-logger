const formatText = function(text: string){
  return text.trim().replace(/\s+/g, " ")
}

const validDateRgx = /^\d{4}-\d{2}-\d{2}$/

export default {formatText, validDateRgx}