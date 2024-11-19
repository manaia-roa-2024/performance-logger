import { Component, Context, ContextType, ReactNode } from "react";
import { LogGroupContext } from "../LGContext";
import { Box, VertBox } from "../../Box";
import './analytics.css'

export default class Analytics extends Component{
  static contextType = LogGroupContext

  context!: ContextType<typeof LogGroupContext>

  render(): ReactNode {

    const group = this.context.logGroup
    const stats = group.getAnalytics()

    return <div className="gm-content">
      <VertBox className="analytics-box">
        <h5 className="tac">Analytics</h5>
        <VertBox className="analytics-table" gap='5px'>
          <Row left='Records' right={stats.records}/>
          <Row left="Min" right={stats.min}/>
          <Row left="Max" right={stats.max}/>
          <Row left="Mean" right={stats.mean}/>
          <Row left="Median" right={stats.median}/>
        </VertBox>
      </VertBox>
    </div>
  }
}

interface RowProps{
  left: string
  right: string
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