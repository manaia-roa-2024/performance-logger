import LogGroup from "../../../models/classes/LogGroup";
import PickOneDropdownInput from "../SimpleForm/Inputs/PickOneDropdownInput";

export default function yDrop(group: LogGroup): PickOneDropdownInput{
  const dropdown = new PickOneDropdownInput('ystat-dropdown')
  dropdown.useContainer = false
  dropdown.useInputBox = false
  dropdown.inputClass = 'ystat-dropdown'
  dropdown.options = Array.from(LogGroup.GroupStats, ([key, gsmv], i) => {
    if (group.yStat === key)
      dropdown.value = i
    return {key, value: gsmv.alias}
  })
  return dropdown
}