import useComponentSetup from "../hooks/useComponentSetup";
import PickOneDropdownInput from "../Inputs/PickOneDropdownInput";
import InputContainer from "./InputContainer";
import InputProps from "../Inputs/InputProps";
import PickOneDropdown from "./Dropdown/PickOneDropdown";
import { DropdownOption } from "./Dropdown/DropdownTypes";

export default function CPickOneDropdown(props: InputProps<PickOneDropdownInput>) {

  const {input, finalProps} = useComponentSetup<PickOneDropdownInput>(props)

  return (
    <InputContainer finalProps={finalProps}>
      <PickOneDropdown id={finalProps.elementId} className={input.getFullInputClass(finalProps)} options={finalProps.options || []}
      selectedOption={finalProps.value} defaultButtonText={finalProps.defaultButtonText} optionClick={(o: DropdownOption, i: number) => input.updateValue(i)}
      angleIcon={finalProps.angleIcon}/>
    </InputContainer>
  )
}
