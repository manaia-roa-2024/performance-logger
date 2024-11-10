import LogRecord from "../../../models/classes/LogRecord";
import SimpleTextInput from "../SimpleForm/Inputs/SimpleTextInput";

export default function CellInput(logRecord: LogRecord){
  const input = new SimpleTextInput('record-input-' + logRecord.id)
  input.value = logRecord.value.toString()
  input.inputClass = 'cell-input'
  input.useContainer = false
  input.useInputBox = false
  return input
}