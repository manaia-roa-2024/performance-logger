class Unit{
  metric: Metric
  alias: string
  convertToBase: (x: number) => number
  constructor(metric: Metric, alias: string, convertToBase: (x: number) => number){
    this.metric = metric
    this.alias = alias
    this.convertToBase = convertToBase
  }
}

class BaseUnit extends Unit{
  converters: Map<string, (x: number) => number>
  constructor(metric: Metric, alias: string, convertToBase: (x: number) => number){
    super(metric, alias, convertToBase)
    this.converters = new Map<string, (x: number) => number>()
  }
}

class Metric{
  units: Map<string, Unit>
  baseUnit: string
  alias: string

  constructor(baseUnit: string, alias: string){
    this.units = new Map<string, Unit>()
    this.baseUnit = baseUnit
    this.alias = alias
  }

  getBase(){
    return this.units.get(this.baseUnit)! as BaseUnit
  }
}

class MetricBuilder{
  metrics: Map<string, Metric>

  constructor(){
    this.metrics = new Map<string, Metric>()
  }
}

export const MetricHandler = (function(){
  const builder = new MetricBuilder()

  const length = new Metric('M', 'Length')
  const metre = length.units.set('cm', new Unit(length, 'Centimeter', x => x / 100))
              .set('M', new BaseUnit(length, 'Meter', x => x))
              .set('km', new Unit(length, 'Kilometer', x => x * 1000))
              .get('M') as BaseUnit
  metre.converters.set('cm', x => x * 100)
                  .set('km', x => x / 1000)
                  .set('M', x => x)

  const mass = new Metric('kg', 'Weight')
  const kg = mass.units.set('kg', new BaseUnit(mass, 'Kilogram', x => x))
            .set('g', new Unit(mass, 'Gram', x => x / 1000))
            .set('lb', new Unit(mass, 'Pound', x => x * 0.45359237))
            .get('kg') as BaseUnit
  kg.converters.set('kg', x => x)
               .set('g', x => x * 1000)
               .set('lb', x => x / 0.45359237)

  const unit = new Metric('unit', 'Unit')
  const baseUnit = unit.units.set('unit', new BaseUnit(unit, 'Unit', x => x)).get('unit') as BaseUnit
  baseUnit.converters.set('unit', x => x)

  builder.metrics.set('length', length).set('mass', mass).set('unit', unit)
  
  const convertTo = function(fromMetricCode: string, fromUnitCode: string, toMetricCode: string, toUnitCode: string, value: number){

    const fromMetric = builder.metrics.get(fromMetricCode)
    const fromUnit = fromMetric?.units.get(fromUnitCode)
    const toMetric = builder.metrics.get(toMetricCode)
    const toUnit = toMetric?.units.get(toUnitCode)

    if (!fromMetric || !fromUnit || !toMetric || !toUnit)
      throw new Error('One of the metrics or units is invalid')

    const baseValue = fromUnit.convertToBase(value)!

    //console.log(toMetricCode, toUnitCode, toMetric)

    const converterFn = toMetric.getBase().converters.get(toUnitCode)!

    return converterFn(baseValue)
  }

  const hasMetric = function(metric: string){
    return builder.metrics.has(metric)
  }

  const hasUnit = function(metric: string, unit: string){
    return Boolean(builder.metrics.get(metric)?.units.get(unit))
  }

  const getMetricAliases = function(){
    return Array.from(builder.metrics.entries(), ([key, value]) =>{
      return value.alias
    })
  }

  const getUnitAliases = function(metric: string){
    return Array.from(builder.metrics.get(metric)!.units.entries(), ([key, value]) =>{
      return value.alias
    })
  }

  const getMetrics = function(){
    return Array.from(builder.metrics.entries())
  }

  const getUnits = function(metric: string){
    return Array.from(builder.metrics.get(metric)!.units.entries())
  }

  const getBaseUnit = function(metric: string){
    return builder.metrics.get(metric)?.baseUnit
  }
  
  return {
    convertTo,
    hasMetric,
    hasUnit,
    getMetricAliases,
    getUnitAliases,
    getMetrics,
    getUnits,
    getBaseUnit
  }
})()