import useComponentSetup from "../hooks/useComponentSetup"
import InputProps from "../Inputs/InputProps"
import SimpleTextAreaInput from "../Inputs/SimpleTextAreaInput"
import InputContainer from "./InputContainer"

export default function CTextAreaInput(props: InputProps<SimpleTextAreaInput>) {

  const {input, finalProps} = useComponentSetup<SimpleTextAreaInput>(props)
  
  return (
    <InputContainer finalProps={finalProps}>
      <textarea {...input.spreadInput(finalProps)}/>
    </InputContainer>
  )
}
