import useComponentSetup from "../hooks/useComponentSetup";
import { SimpleCurrencyInput } from "../Inputs/SimpleNumberInput";
import InputContainer from "./InputContainer";
import InputProps from "../Inputs/InputProps";

export default function CCurrencyInput(props: InputProps<SimpleCurrencyInput>){
  const {input, finalProps} = useComponentSetup<SimpleCurrencyInput>(props)

  return <InputContainer finalProps={finalProps}>
    <input type='text' {...input.spreadInput(finalProps)}/>
    <div className='sf-currency-symbol-box'>
      $
    </div>
  </InputContainer>
}