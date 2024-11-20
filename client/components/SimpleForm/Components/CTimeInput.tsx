import useComponentSetup from "../hooks/useComponentSetup";
import InputProps from "../Inputs/InputProps";
import SimpleTimeInput from "../Inputs/SimpleTimeInput";
import InputContainer from "./InputContainer";

export default function CTimeInput(props: InputProps<SimpleTimeInput>){
  const {input, finalProps} = useComponentSetup(props)

  return <InputContainer finalProps={finalProps}>
    <input type='text' {...input.spreadInput(finalProps)}/>
  </InputContainer>
}