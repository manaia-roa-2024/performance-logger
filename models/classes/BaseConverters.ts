const basic = (x: string, fn: (n: number) => number) =>{
  const n = Number(x)
    return x === '' || isNaN(n) ? null : fn(n) 
}

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
  g: {
    toBase: (x: string) => basic(x, n => n / 1000),
    fromBase: (n: number) => (n * 1000).toString()
  },
  lb: {
    toBase: (x: string) => basic(x, n => n * 0.45359237),
    fromBase: (n: number) => (n / 0.45359237).toString()
  }
}


export default UnitConverters