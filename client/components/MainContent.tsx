import { Component } from 'react'
import { VertBox } from './Box'
import ContentChild from './ContentChild'
import LogGroups from './LogGroups'

export default class MainContent extends Component {

  render() {
    return (
      <VertBox tag='section' className='aic main-content main-height' gap='50px'>
        <ContentChild className='simple-center mc-header'>
          <h1>Track your performance</h1>
        </ContentChild>
        <VertBox gap='40px'>
          <ContentChild>
            <VertBox gap='15px'>
              <button className='green-button fs2 cp'>Add New Group</button>
              <div className='separator'></div>
            </VertBox>   
          </ContentChild>
          <ContentChild>
            <LogGroups/>
          </ContentChild>
        </VertBox>
        
      </VertBox>
    )
  }
}

