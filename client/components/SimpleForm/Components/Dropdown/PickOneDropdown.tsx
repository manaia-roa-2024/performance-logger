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
  angleIcon?: ReactNode,
  tabIndex: number | undefined
}

interface State{
  keyboardIndex: number | null
}

export default class PickOneDropdown<K> extends React.Component<Props<K>, State>{
  
  constructor(props: Props<K>){
    super(props)
    this.state = {
      keyboardIndex: 0
    }
  }

  setKeyboardIndex(newIndex: number | null){
    this.setState(prev => {
      return {...prev, keyboardIndex: newIndex}
    })
  }

  getSelectedOption(): DropdownOption<K> | undefined{
    return this.props.selectedOption == null ? undefined : this.props.options[this.props.selectedOption]
  }
  
  render(){

    const beforeDropdownClick = (clickState: string, element: Element, setDropdownOpen: Dispatch<React.SetStateAction<boolean>>) =>{
      const optionElement: HTMLElement | null = element.closest('.sf-dropdown-option')
      this.setKeyboardIndex(this.props.selectedOption ?? null)
      if (optionElement && clickState === 'content_click'){
        const index = Number(optionElement.dataset.index)
        if (this.props.optionClick) 
          this.props.optionClick(this.props.options[index], index)
        setDropdownOpen(false)
        return true
      }
      return false
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, dropdownOpen: boolean) =>{
      if (!dropdownOpen) return
      if (e.key === 'ArrowDown'){
        this.setKeyboardIndex(this.state.keyboardIndex == null ? 0 : Math.min(this.props.options.length - 1, this.state.keyboardIndex + 1))
        e.preventDefault()
      } else if (e.key === 'ArrowUp'){
        this.setKeyboardIndex(this.state.keyboardIndex == null ? this.props.options.length - 1 : Math.max(0, this.state.keyboardIndex - 1))
        e.preventDefault()
      } else if (e.key === 'Enter' && this.state.keyboardIndex != null){
        this.props.optionClick(this.props.options[this.state.keyboardIndex], this.state.keyboardIndex)
      }
    }

    return <Dropdown onKeyDown={onKeyDown} buttonTabIndex={this.props.tabIndex} id={this.props.id} className={this.props.className} beforeDropdownClick={beforeDropdownClick} angleIcon={this.props.angleIcon} buttonText={this.getSelectedOption()?.value || this.props.defaultButtonText || 'Select One'}>
      {this.props.options.map((option, index) =>{
        return (<div role="button" tabIndex={-1} key={option.key as React.Key} className={cls('sf-dropdown-option', index === this.props.selectedOption && 'sf-selected', this.state.keyboardIndex === index && 'keyboard')} data-index={index}>
          {option.value}
        </div>)
      })}
    </Dropdown>
  }
}