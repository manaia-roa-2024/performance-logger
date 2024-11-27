const basic = (x: string, fn: (n: number) => number) =>{
  const n = Number(x)
    return x === '' || isNaN(n) ? null : fn(n) 
}

const timeReg = /(^\d+:\d+:\d+$)|(^\d+:\d+$)|(^\d+$)/

const UnitConverters = {
  Identity: {
    toBase: (x: string) => basic(x, n => n),
    fromBase: (n: number) => n.toString()
  },
  cm: {
    toBase: (x: string) => basic(x, n => n / 100),
    fromBase: (n: number) => (n * 100).toString()
  },
  km: {
    toBase: (x: string) => basic(x, n => n * 1000),
    fromBase: (n: number) => (n / 1000).toString()
  },
  mi: {
    toBase: (x: string) => basic(x, n => n / 0.000621371),
    fromBase: (n: number) => (n * 0.000621371).toString()
  },
  ft: {
    toBase: (x: string) => basic(x, n => n / 3.28084),
    fromBase: (n: number) => (n * 3.28084).toString()
  },
  g: {
    toBase: (x: string) => basic(x, n => n / 1000),
    fromBase: (n: number) => (n * 1000).toString()
  },
  lb: {
    toBase: (x: string) => basic(x, n => n * 0.45359237),
    fromBase: (n: number) => (n / 0.45359237).toString()
  },
  seconds: {
    toBase: (x: string) => basic(x, n => Math.abs(n)),
    fromBase: (n: number) => Math.abs(n).toString()
  },
  duration: {
    toBase: (x: string) =>{
      const match = x.match(timeReg)
      if (match == null) return null
    
      const parts = x.split(':').map(s => Number(s))
    
      let hh = 0
      let mm = 0
      let ss = 0
    
      switch (parts.length){
        case 3:
          hh = parts[0] ?? 0
          mm = parts[1] ?? 0
          ss = parts[2] ?? 0
          break;
        case 2:
          mm = parts[0] ?? 0
          ss = parts[1] ?? 0
          break
        case 1:
          ss = parts[0] ?? 0
      }
      //console.log(hh, mm, ss)
    
      const seconds = ss + (60 * mm) + (3600 * hh)
      return seconds
    },
    fromBase: (n: number) =>{
      n = Math.abs(n)
      const hh = Math.floor(n / 3600)
      const mm = Math.floor((n % 3600) / 60)
      const ss = Math.round(n % 60)
    
      const zeroInFront = (n: number) =>{
        return n < 10 ? ('0'+n) : ('' + n)
      }
    
      //console.log(hh, mm, ss)
    
      if (hh === 0){
        return `${zeroInFront(mm)}:${zeroInFront(ss)}`
      } else
        return `${zeroInFront(hh)}:${zeroInFront(mm)}:${zeroInFront(ss)}`
    }
  }
}


export default UnitConverters