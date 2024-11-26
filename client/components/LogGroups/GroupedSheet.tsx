import { Component, ReactNode } from "react";
import { ILogGroupContext, LogGroupContext } from "./LGContext";
import { GroupStats } from "../../../models/classes/LogGroup";
import { Box } from "../Box";

export default class GroupedSheet extends Component{
  static contextType = LogGroupContext;
  context!: ILogGroupContext
  render(): ReactNode {
    const gb = this.context.logGroup.groupBy
    return <>
      <Box className="record-row">
        <div className="record-cell static df aic bold">
          {gb[0].toUpperCase() + gb.slice(1)}
        </div>
        <div className="record-cell static df aic bold">
          Average
        </div>
      </Box>
      {
        this.context.groupData.map((data, i, arr) => <GroupRecord key={data.dateStart} n={arr.length - i} data={data}/>)
      }
    </>
  }
}

interface Props{
  data: GroupStats,
  n: number
}

class GroupRecord extends Component<Props>{
  static contextType = LogGroupContext;
  context!: ILogGroupContext

  render(): ReactNode {
    return <Box className="record-row">
      <div className="record-cell static df aic">
        {this.props.n}
      </div>
      <div className="record-cell static df aic">
        {this.context.logGroup.getConvertedValue(this.props.data.mean!)}
      </div>
    </Box>
  }
}