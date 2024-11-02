import { Component } from 'react'
import { VertBox } from './Box'
import ContentChild from './ContentChild'

export default class MainContent extends Component {

  render() {
    return (
      <VertBox tag='section' className='aic main-content main-height'>
        <ContentChild className='simple-center mc-header'>
          <h1>Track your performance</h1>
        </ContentChild>
      </VertBox>
    )
  }
}
