import SimpleTextInput from "../Inputs/SimpleTextInput";
import InputProps from "../Inputs/InputProps";
import useComponentSetup from "../hooks/useComponentSetup";
import InputContainer from "./InputContainer";

//ComponentTextInput
export default function CTextInput(props: InputProps<SimpleTextInput>){

  const {input, finalProps} = useComponentSetup<SimpleTextInput>(props)
 
  return (
    <InputContainer finalProps={finalProps}>
      <input type='text' {...input.spreadInput(finalProps)}/>
    </InputContainer>
  )
}
