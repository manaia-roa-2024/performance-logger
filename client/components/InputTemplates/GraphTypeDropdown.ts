import LogGroup from "../../../models/classes/LogGroup";
import PickOneDropdownInput from "../SimpleForm/Inputs/PickOneDropdownInput";

export default function GraphTypeDropdown(group: LogGroup): PickOneDropdownInput{
  const dropdown = new PickOneDropdownInput('graphtype-dropdown')
  dropdown.label = 'Graph Type'
  dropdown.containerClass = 'vert-flex g3 fg1 metric-dropdown-con'
  dropdown.inputClass = 'metric-entry'
  dropdown.options = Array.from(LogGroup.GraphTypes, (opt, i) =>{
    if (group.graphType === opt)
      dropdown.value = i
    return {key: opt, value: opt[0].toUpperCase() + opt.slice(1)}
  })
  return dropdown
}