import { Component, ReactNode } from "react";
import { ILogGroupContext, LogGroupContext } from "./LGContext";
import { GroupStats } from "../../../models/classes/LogGroup";
import { Box } from "../Box";
import Util from "../../../Util";

export default class GroupedSheet extends Component{
  static contextType = LogGroupContext;
  context!: ILogGroupContext
  render(): ReactNode {
    const gb = this.context.logGroup.groupBy
    return <>
      <Box className="record-row">
        <div className="record-cell group-cell static df aic bold">
          {gb[0].toUpperCase() + gb.slice(1)}
        </div>
        <div className="record-cell group-cell static df aic bold">
          Average
        </div>
      </Box>
      {
        this.context.groupData.map((data, i, arr) => <GroupRecord key={data.dateStart} groupIndex={gb === 'month' ? Util.toMonthAndYear(Util.fromISO(data.dateStart), false) : arr.length - i} data={data}/>)
      }
    </>
  }
}

interface Props{
  data: GroupStats,
  groupIndex: number | string
}

class GroupRecord extends Component<Props>{
  static contextType = LogGroupContext;
  context!: ILogGroupContext

  render(): ReactNode {
    return <Box className="record-row">
      <div className="record-cell group-cell static df aic">
        {this.props.groupIndex}
      </div>
      <div className="record-cell group-cell static df aic">
        {this.context.logGroup.getConvertedValue(this.props.data.mean!)}
      </div>
    </Box>
  }
}