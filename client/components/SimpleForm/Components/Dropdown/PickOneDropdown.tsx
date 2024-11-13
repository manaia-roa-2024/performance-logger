import React, {Dispatch} from 'react'
import { Dropdown } from './BaseDropdown'
import cls from '../../cls'
import { ReactNode } from 'react'
import { DropdownOption, DropdownOptions } from './DropdownTypes'


export interface Props<K=string>{
  options: DropdownOptions<K>
  optionClick: (option: DropdownOption<K>, index: number) => void,
  selectedOption?: number,
  defaultButtonText?: string,
  className?: string,
  id?: string,
  angleIcon?: ReactNode
}

export default class PickOneDropdown<K> extends React.Component<Props<K>>{
  
  constructor(props: Props<K>){
    super(props)
  }

  getSelectedOption(): DropdownOption<K> | undefined{
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

    return <Dropdown id={this.props.id} className={this.props.className} beforeDropdownClick={beforeDropdownClick} angleIcon={this.props.angleIcon} buttonText={this.getSelectedOption()?.value || this.props.defaultButtonText || 'Select One'}>
      {this.props.options.map((option, index) =>{
        return (<div key={option.key as React.Key} className={cls('sf-dropdown-option', index === this.props.selectedOption && 'sf-selected')} data-index={index}>
          {option.value}
        </div>)
      })}
    </Dropdown>
  }
}