import { Component } from 'react'
import { VertBox } from './Box'
import ContentChild from './ContentChild'
import LogGroupPanel from './LogGroups/LogGroupPanel'
import AddGroupButton from './AddGroupButton'

export default class MainContent extends Component {
  render() {
    return (
      <VertBox
        tag="section"
        className="aic main-content main-height"
        gap="50px"
      >
        <ContentChild className="simple-center mc-header">
          <h1>Track your performance</h1>
        </ContentChild>
        <VertBox gap="40px">
          <ContentChild>
            <VertBox gap="15px">
              <AddGroupButton/>
              <div className="separator"></div>
            </VertBox>
          </ContentChild>
          <ContentChild>
            <LogGroupPanel />
          </ContentChild>
        </VertBox>
      </VertBox>
    )
  }
}
