import LogRecord from "../../../models/classes/LogRecord";
import { MetricHandler } from "../../../models/classes/MetricHandler";
import SimpleTextInput from "../SimpleForm/Inputs/SimpleTextInput";

export default function CellInput(logRecord: LogRecord){
  const input = new SimpleTextInput('record-input-' + logRecord.id)
  const metric = logRecord.logGroup.metric
  const unit = logRecord.logGroup.unit
  //input.value = MetricHandler.convertTo(metric, MetricHandler.getBaseUnit(metric)!, metric, unit, logRecord.value).toString()//logRecord.value.toString()
  input.inputClass = 'cell-input'
  input.useContainer = false
  input.useInputBox = false
  return input
}