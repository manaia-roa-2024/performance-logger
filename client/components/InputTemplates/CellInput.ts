import LogRecord from "../../../models/classes/LogRecord";
import { SimpleNumberInput } from "../SimpleForm/Inputs/SimpleNumberInput";
import SimpleTimeInput from "../SimpleForm/Inputs/SimpleTimeInput";

export default function CellInput(logRecord: LogRecord){
  let input: SimpleTimeInput | SimpleNumberInput
  const group = logRecord.logGroup

  if (group.isDuration()){
    input = new SimpleTimeInput(logRecord.getInputId())
  } else{
    input = new SimpleNumberInput(logRecord.getInputId())
    if (group.isTime()){
      input.min = 0
    }
  }

  input.elementId = logRecord.getInputId()
  input.inputClass = 'cell-input'
  input.useContainer = false
  input.useInputBox = false
  return input
}