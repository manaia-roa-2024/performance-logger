import SimpleCheckboxInput from "../Inputs/SimpleCheckboxInput";
import InputProps from "../Inputs/InputProps";
import useComponentSetup from "../hooks/useComponentSetup";
import InputContainer from "./InputContainer";

export default function CCheckboxInput(props: InputProps<SimpleCheckboxInput>) {
  const {input, finalProps} = useComponentSetup<SimpleCheckboxInput>(props)
  
  return (
    <InputContainer finalProps={finalProps}>
      <div {...input.spreadInput(finalProps)} onClick={() => input.updateValue(!input.value)}>
        {finalProps.value && (finalProps.checkElement || <Check/>)}
      </div>
    </InputContainer>
  )

  function Check(){
    return <svg className='sf-check' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
    </svg>
  } 
}
