import useComponentSetup from "../hooks/useComponentSetup";
import InputProps from "../Inputs/InputProps";
import { SimpleNumberInput } from "../Inputs/SimpleNumberInput";
import InputContainer from "./InputContainer";

export default function CNumberInput(props: InputProps<SimpleNumberInput>)
{
  const {input, finalProps} = useComponentSetup(props)

  return <InputContainer finalProps={finalProps}>
    <input type='text' {...input.spreadInput(finalProps)}/>
  </InputContainer>
}