

export default function getDateSorter(asc=true){
  return function(a: {date: string}, b: {date: string}){
    const d1 = new Date(a.date)
    const d2 = new Date(b.date)
    return asc ? (d1.getTime() - d2.getTime()) : (d2.getTime() - d1.getTime())
  }
}