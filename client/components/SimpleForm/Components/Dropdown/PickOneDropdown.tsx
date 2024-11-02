import React, {Dispatch} from 'react'
import { Dropdown } from './BaseDropdown'
import cls from '../../cls'
import { ReactNode } from 'react'


export interface Props{
  options: Array<string>
  optionClick: (option: string, index: number) => void,
  selectedOption?: number,
  defaultButtonText?: string,
  className?: string,
  id?: string,
  angleIcon?: ReactNode
}

export default class PickOneDropdown extends React.Component<Props>{
  
  constructor(props: Props){
    super(props)
  }

  getSelectedOption(): string | undefined{
    return this.props.selectedOption == null ? undefined : this.props.options[this.props.selectedOption]
  }
  
  render(){

    const beforeDropdownClick = (clickState: string, element: Element, setDropdownOpen: Dispatch<React.SetStateAction<boolean>>) =>{
      const optionElement: HTMLElement | null = element.closest('.sf-dropdown-option')
      if (optionElement && clickState === 'content_click'){
        const index = Number(optionElement.dataset.index)
        if (this.props.optionClick) this.props.optionClick(this.props.options[index], index)
        setDropdownOpen(false)
        return true
      }
      return false
    }

    return <Dropdown id={this.props.id} className={this.props.className} beforeDropdownClick={beforeDropdownClick} angleIcon={this.props.angleIcon} buttonText={this.getSelectedOption() || this.props.defaultButtonText || 'Select One'}>
      {this.props.options.map((option, index) =>{
        return (<div key={option} className={cls('sf-dropdown-option', index === this.props.selectedOption && 'sf-selected')} data-index={index}>
          {option}
        </div>)
      })}
    </Dropdown>
  }
}