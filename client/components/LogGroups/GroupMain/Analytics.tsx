import { Component, ContextType, ReactNode } from "react";
import { LogGroupContext } from "../LGContext";
import { Box, VertBox } from "../../Box";
import './analytics.css'

export default class Analytics extends Component{
  static contextType = LogGroupContext

  context!: ContextType<typeof LogGroupContext>

  render(): ReactNode {

    const group = this.context.logGroup
    const stats = group.getAnalytics()

    const gd = this.context.groupData

    let diff: string | number = 'N/A'
    if (gd.length > 0){
      diff = (gd[0].mean! - gd[gd.length - 1].mean!) / (gd.length - 1)
      diff = group.getConvertedValueBlacklist(diff)
    }

    return <div className="gm-content">
      <VertBox className="analytics-box">
        <h5 className="tac">Analytics</h5>
        <VertBox className="analytics-table" gap='5px'>
          <Row left='Records' right={stats.records}/>
          <Row left="Average" right={stats.mean}/>
          <Row left="Median" right={stats.median}/>
          <Row left="Min" right={stats.min}/>
          <Row left="Max" right={stats.max}/>
          {group.groupBy === 'month' && <Row left="Average monthly (±)" right={diff}/>}
          {group.groupBy === 'week' && <Row left="Average weekly (±)" right={diff}/>}
        </VertBox>
      </VertBox>
    </div>
  }
}

interface RowProps{
  left: string | number
  right: string | number
}

class Row extends Component<RowProps>{
  render(): ReactNode {
    return <Box className="ana-row">
    <div className="ana-col">
      <p>{this.props.left}</p>
    </div>
    <div className="ana-col">
      <p className="tar">{this.props.right}</p>
    </div>
  </Box>
  }
}