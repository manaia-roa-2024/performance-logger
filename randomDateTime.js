export default function randomDateTime(dateStart, dateEnd){
  const unixStart = dateStart.getTime()
  const unixEnd = dateEnd.getTime()
  const deltaUnix = unixEnd - unixStart
  return new Date(unixStart + Math.random() * deltaUnix)
}