import LogGroup from "../../../models/classes/LogGroup";
import PickOneDropdownInput from "../SimpleForm/Inputs/PickOneDropdownInput";

export default function groupByDropdown(group: LogGroup): PickOneDropdownInput{
  const dropdown = new PickOneDropdownInput('groupby-dropdown')
  dropdown.label = 'Group By'
  dropdown.containerClass = 'vert-flex g3 fg1'
  dropdown.inputClass = 'metric-entry'
  dropdown.options = Array.from(LogGroup.GroupByOptions, (opt, i) => {
    if (group.groupBy === opt)
      dropdown.value = i
    return {key: opt, value: opt[0].toUpperCase() + opt.slice(1)}
  })
  return dropdown
}