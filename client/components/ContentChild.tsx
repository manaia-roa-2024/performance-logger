import { Component, ReactNode } from 'react'
import cls from './SimpleForm/cls'

interface Props{
  className?: string
  children?: ReactNode,
}

export default class ContentChild extends Component<Props & React.HTMLAttributes<HTMLElement>> {
  constructor(props: Props & React.HTMLAttributes<HTMLElement>) {
    super(props)

  }

  render() {

    const {className, children, ...others} = this.props

    return (
      <section className={cls('content-child', className)} {...others}>
        {children}
      </section>
    )
  }
}
