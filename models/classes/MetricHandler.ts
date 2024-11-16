import { build } from "vite"
import UnitConverters from "./BaseConverters"

export type BaseConverter = (x: string) => (number | null)
export type FromBaseConverter = (x: number) => string

class Unit{
  metric: Metric
  alias: string
  convertToBase: BaseConverter
  constructor(metric: Metric, alias: string, convertToBase: BaseConverter){
    this.metric = metric
    this.alias = alias
    this.convertToBase = convertToBase
  }
}

class BaseUnit extends Unit{
  converters: Map<string, (x: number) => string>
  constructor(metric: Metric, alias: string){
    super(metric, alias, UnitConverters.Identity.toBase)
    this.converters = new Map()
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
  const metre = length.units.set('cm', new Unit(length, 'Centimeter', UnitConverters.cm.toBase))
              .set('M', new BaseUnit(length, 'Meter'))
              .set('km', new Unit(length, 'Kilometer', UnitConverters.km.toBase))
              .get('M') as BaseUnit
  metre.converters.set('cm', UnitConverters.cm.fromBase)
                  .set('km', UnitConverters.km.fromBase)
                  .set('M', UnitConverters.Identity.fromBase)

  const mass = new Metric('kg', 'Weight')
  const kg = mass.units.set('kg', new BaseUnit(mass, 'Kilogram'))
            .set('g', new Unit(mass, 'Gram', UnitConverters.g.toBase))
            .set('lb', new Unit(mass, 'Pound', UnitConverters.lb.toBase))
            .get('kg') as BaseUnit
  kg.converters.set('kg', UnitConverters.Identity.fromBase)
               .set('g', UnitConverters.g.fromBase)
               .set('lb', UnitConverters.lb.fromBase)

  const unit = new Metric('unit', 'Unit')
  const baseUnit = unit.units.set('unit', new BaseUnit(unit, 'Unit')).get('unit') as BaseUnit
  baseUnit.converters.set('unit', UnitConverters.Identity.fromBase)

  builder.metrics.set('length', length).set('mass', mass).set('unit', unit)
  
  const convertTo = function(fromMetricCode: string, fromUnitCode: string, toMetricCode: string, toUnitCode: string, value: string){

    const fromMetric = builder.metrics.get(fromMetricCode)
    const fromUnit = fromMetric?.units.get(fromUnitCode)
    const toMetric = builder.metrics.get(toMetricCode)
    const toUnit = toMetric?.units.get(toUnitCode)

    if (!fromMetric || !fromUnit || !toMetric || !toUnit)
      throw new Error('One of the metrics or units is invalid')

    const baseValue = fromUnit.convertToBase(value)

    if (baseValue == null){
      console.error(`Cannot convert value ${value} from ${fromMetricCode}(${fromUnitCode}) to ${toMetricCode}(${toUnitCode})`)
      return null
    }
    //console.log(toMetricCode, toUnitCode, toMetric)

    const converterFn = toMetric.getBase().converters.get(toUnitCode)!

    return converterFn(baseValue)
  }

  const convertToBase = (metric: string, unit: string, value: string) => {
    const baseUnit = builder.metrics.get(metric)?.baseUnit
    if (baseUnit == null)
      throw new Error(`Invalid metric of ${metric}(${unit})`)

    return Number(convertTo(metric, unit, metric, baseUnit, value))
  }

  const convertFromBase = (metric: string, toUnit: string, value: number) => {
    const baseUnit = builder.metrics.get(metric)?.baseUnit
    if (baseUnit == null)
      throw new Error(`Invalid metric of ${metric}(${unit})`)

    return convertTo(metric, baseUnit, metric, toUnit, value.toString())
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
    getBaseUnit,
    convertToBase,
    convertFromBase
  }
})()