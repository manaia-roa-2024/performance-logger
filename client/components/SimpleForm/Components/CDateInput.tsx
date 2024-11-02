import useComponentSetup from "../hooks/useComponentSetup";
import InputProps from "../Inputs/InputProps";
import SimpleDateInput from "../Inputs/SimpleDateInput";
import InputContainer from "./InputContainer";

export default function CDateInput(props: InputProps<SimpleDateInput>) {
  const {input, finalProps} = useComponentSetup<SimpleDateInput>(props)


  return (
    <InputContainer finalProps={finalProps}>
      <input type='date' {...input.spreadInput(finalProps)}/>
    </InputContainer>
  )
}
