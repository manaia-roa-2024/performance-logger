import { RequestHandler } from "express";
import { ILogGroup } from "../../models/classes/LogGroup";
import ProblemDetails from "../ProblemDetails";
import { MetricHandler } from "../../models/MetricHandler";
import Util from "../Util";
import { ILogRecord } from "../../models/classes/LogRecord";

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

const LogGroup: RequestHandler = function(req, res, next){
  const dto = req.body as ToDict<ILogGroup>

  if (!dto || typeof(dto) !== 'object')
    throw ProblemDetails.UserError('Expected an object')

  cna(dto, 'name', 'metric', 'unit') // check that all the following properties are not null

  ct('name', dto.name, 'string')

  if (!MetricHandler.hasMetric(dto.metric))
    throw ProblemDetails.PropertyError('metric', `Invalid metric of '${dto.metric}'`)

  if (!MetricHandler.hasUnit(dto.metric, dto.unit))
    throw ProblemDetails.PropertyError(dto.unit, `Invalid unit of '${dto.unit}'`)

  req.body.name = Util.formatText(req.body.name)

  if (req.body.name.length < 1 || req.body.name.length > 32)
    throw ProblemDetails.PropertyError('name', 'Name must be between 1 and 32 characters')

  next()
}

const LogRecord: RequestHandler = function (req, res, next){
  const dto = req.body as ToDict<ILogRecord>
  console.log(dto)

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

export default {LogGroup, LogRecord}