import useComponentSetup from "../hooks/useComponentSetup";
import PickOneDropdownInput from "../Inputs/PickOneDropdownInput";
import InputContainer from "./InputContainer";
import InputProps from "../Inputs/InputProps";
import PickOneDropdown from "./Dropdown/PickOneDropdown";

export default function CPickOneDropdown(props: InputProps<PickOneDropdownInput>) {

  const {input, finalProps} = useComponentSetup<PickOneDropdownInput>(props)

  return (
    <InputContainer finalProps={finalProps}>
      <PickOneDropdown id={finalProps.id} className={input.getFullInputClass(finalProps)} options={finalProps.options || []}
      selectedOption={finalProps.value} defaultButtonText={finalProps.defaultButtonText} optionClick={(o: string, i: number) => input.updateValue(i)}
      angleIcon={finalProps.angleIcon}/>
    </InputContainer>
  )
}
