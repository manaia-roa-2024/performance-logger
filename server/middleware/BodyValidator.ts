import { RequestHandler } from "express";
import LogGroup, { PartialLogGroup } from "../../models/classes/LogGroup";
import ProblemDetails from "../ProblemDetails";
import { MetricHandler } from "../../models/classes/MetricHandler";
import Util from "../../Util";
import { PartialLogRecord } from "../../models/classes/LogRecord";
import Dict from "../../models/Dict";
import Optional from "../../models/Optional";

/*type Optional<T> ={
  [prop in keyof T]?: T[prop]
}*/

type ToDict<T>={
  [prop in keyof T]: T[prop]
} & {
  [key: string]: unknown
}

function ct(propName: string, propValue: unknown, expectedType: string){ // ct = correctType
  if (typeof(propValue) !== expectedType)
    throw ProblemDetails.PropertyError(propName, `${propName} must be of type ${expectedType}`)
}

function cn(propName: string, propValue: unknown){ // cn = checkNull
  if (propValue == null)
    throw ProblemDetails.PropertyMissingError(propName)
}

function cna(dto: Record<string, unknown>, ...propertyNames: Array<string>){ //cna = checkNullAll
  for (const propertyName of propertyNames){
    cn(propertyName, dto[propertyName])
  }
}

const CreateLogGroup: RequestHandler = function(req, res, next){
  const dto = req.body as ToDict<PartialLogGroup>

  if (!dto || typeof(dto) !== 'object')
    throw ProblemDetails.UserError('Expected an object')

  cna(dto, 'name', 'metric', 'unit', 'groupBy') // check that all the following properties are not null

  ct('name', dto.name, 'string')

  if (!MetricHandler.hasMetric(dto.metric))
    throw ProblemDetails.PropertyError('metric', `Invalid metric of '${dto.metric}'`)

  if (!MetricHandler.hasUnit(dto.metric, dto.unit))
    throw ProblemDetails.PropertyError('unit', `Invalid unit of '${dto.unit}'`)

  if (!LogGroup.GroupByOptions.has(dto.groupBy))
    throw ProblemDetails.PropertyError('groupBy', `Invalid groupBy of ${dto.groupBy}`)

  req.body.name = Util.formatText(req.body.name)

  if (req.body.name.length < 1 || req.body.name.length > 32)
    throw ProblemDetails.PropertyError('name', 'Name must be between 1 and 32 characters')

  next()
}

const mutableGroupProperties = new Set(['name', 'metric', 'unit', 'groupBy'])
const mutableRecordProperties = new Set(['date', 'value'])

function createMutateObj(mutateSet: Set<string>, obj: Dict){
  const mutateObj: Dict = {}
  for (const key in obj){
    if (mutateSet.has(key))
      mutateObj[key] = obj[key]
    else {
      throw ProblemDetails.PropertyError(key, `Property '${key}' either does not exist or can not be mutated`)
    }
  }
  if (Object.keys(mutateObj).length === 0)
    throw ProblemDetails.UserError("There doesn't appear to be anything to update.")
  return mutateObj
}

const EditLogGroup: RequestHandler = function(req, res, next){
  const dto = req.body as ToDict<Optional<PartialLogGroup>>

  if (!dto || typeof(dto) !== 'object')
    throw ProblemDetails.UserError('Expected an object')

  if (dto.metric != null && !MetricHandler.hasMetric(dto.metric))
    throw ProblemDetails.PropertyError('metric', `Invalid metric of '${dto.metric}'`)

  if (dto.unit != null && !MetricHandler.hasUnit(dto.metric!, dto.unit))
    throw ProblemDetails.PropertyError(dto.unit, `Invalid unit of '${dto.unit}'`)

  if (dto.groupBy != null && !LogGroup.GroupByOptions.has(dto.groupBy))
    throw ProblemDetails.PropertyError('groupBy', `Invalid groupBy of ${dto.groupBy}`)

  if (dto.name != null){
    req.body.name = Util.formatText(req.body.name)

    if (req.body.name.length < 1 || req.body.name.length > 32)
      throw ProblemDetails.PropertyError('name', 'Name must be between 1 and 32 characters')
  }

  req.body = createMutateObj(mutableGroupProperties, dto)

  next()
}

const CreateLogRecord: RequestHandler = function (req, res, next){
  const dto = req.body as ToDict<PartialLogRecord>

  if (!dto || typeof(dto) !== 'object')
    throw ProblemDetails.UserError('Expected an object')

  cna(dto, 'value', 'date', 'logGroupId')

  ct('value', dto.value, 'number')
  ct('date', dto.date, 'string')
  ct('logGroupId', dto.logGroupId, 'number')

  if (!Date.parse(dto.date) || !Util.validDateRgx.test(dto.date))
    throw ProblemDetails.PropertyError('date', 'date is invalid, must be a valid date of type yyyy-mm-dd')

  next()
}

const EditLogRecord: RequestHandler = function (req, res, next){
  const dto = req.body as ToDict<PartialLogRecord>

  if (!dto || typeof(dto) !== 'object')
    throw ProblemDetails.UserError('Expected an object')

  if (dto.date != null && (!Date.parse(dto.date) || !Util.validDateRgx.test(dto.date)))
    throw ProblemDetails.PropertyError('date', 'date is invalid, must be a valid date of type yyyy-mm-dd')

  dto.value != null && ct('value', dto.value, 'number')

  req.body = createMutateObj(mutableRecordProperties, dto)

  next()
}

export default {CreateLogGroup, EditLogGroup, CreateLogRecord, EditLogRecord}