const formatText = function(text: string){
  return text.trim().replace(/\s+/g, " ")
}

const validDateRgx = /^\d{4}-\d{2}-\d{2}$/

function toISODate(date: Date){
  return date.toISOString().substring(0, 10)
}

function toLocalISODate(date: Date){
  return toISODate(getLocalDate(date))
}

function createTimeStamp(){
  return (new Date()).toISOString()
}

function fromISO(iso: string){
  return new Date(iso)
}

const getWeekStart = (date: Date) =>{
  const day = date.getDay() == 0 ? 7 : date.getDay()
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()-day + 1))
}

const getWeekEnd = (date: Date) =>{
  const day = date.getDay() == 0 ? 7 : date.getDay()
  return new Date( Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + (7 - day)))
}

const getMonthStart = (date: Date) =>{
  return new Date( Date.UTC(date.getFullYear(), date.getMonth(), 1))
}

const getMonthEnd = (date: Date) =>{
  return new Date( Date.UTC(date.getFullYear(), date.getMonth()+1, 0))
}

const getLocalDate = (date: Date) =>{
  const utc = date == null ? new Date() : date
  return new Date(Date.UTC(utc.getTime() - (utc.getTimezoneOffset() * 60000)))
}

const toMonthAndYear = (date: Date, longHand=true) =>{
  return longHand ? `${longHandMonths[date.getMonth()]} ${date.getFullYear()}` : `${shortHandMonths[date.getMonth()]} ${date.getFullYear()}`
}

const divButtonHandler = (e: React.KeyboardEvent<HTMLDivElement>) =>{
  return (e.key === 'Enter') && (e.target as HTMLDivElement).click()
}

const shortHandMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const longHandMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default {formatText, validDateRgx, toISODate, createTimeStamp, fromISO, getWeekStart, getWeekEnd, getMonthStart, toLocalISODate,
  getMonthEnd, shortHandMonths, longHandMonths, toMonthAndYear, divButtonHandler
}