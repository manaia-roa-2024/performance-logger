import { SimpleNumberInput } from "../SimpleForm/Inputs/SimpleNumberInput";
import SimpleTimeInput from "../SimpleForm/Inputs/SimpleTimeInput";

export function NumberEntry(): SimpleNumberInput{
  const entry = new SimpleNumberInput('value-entry')
  entry.placeholder = 'New Entry'
  entry.inputClass = 'entry-input entry-value'
  entry.useInputBox = false
  entry.useContainer = false
  return entry
}

export function TimeEntry(): SimpleTimeInput{
  const entry = new SimpleTimeInput('value-entry')
  entry.placeholder = 'hh:mm:ss'
  entry.inputClass = 'entry-input entry-value'
  entry.useInputBox = false
  entry.useContainer = false
  return entry
}