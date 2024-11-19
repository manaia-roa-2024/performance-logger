import { Component, Context, ContextType, ReactNode } from "react"
import CanvasJSReact from '@canvasjs/react-charts'
import { LogGroupContext } from "../LGContext";
import SimpleDateInput from "../../SimpleForm/Inputs/SimpleDateInput";
import { MetricHandler } from "../../../../models/classes/MetricHandler";

export default class Graphs extends Component{

  static contextType = LogGroupContext;

  context!: ContextType<typeof LogGroupContext>

  render(): ReactNode {

    const logGroup = this.context.logGroup

    const dataPoints = logGroup.logRecords.map(lr =>{
      const date = new Date(lr.date)
      return {
        x: date,
        y: Number(lr.getConvertedValue()),
        label: SimpleDateInput.toISODate(date),
        indexLabel: undefined,
        toolTipContent: undefined
      }
    })

    console.log(dataPoints)

    const CanvasJS = CanvasJSReact.CanvasJS;
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;

    const options = {
      theme: "light2",
      title: {
          text: "Trend"
      },
      axisY: {
        title: logGroup.unit === 'unit' ? undefined : (`${MetricHandler.getMetricAlias(logGroup.metric)} (${MetricHandler.getCode(logGroup.metric, logGroup.unit)})`),
        labelFormatter: function(e){
          console.log(e)
          return e.value
        }
      },
      data: [{
          type: "line",
          xValueFormatString: "MMM YYYY",
          yValueFormatString: "#,##0.00",
          dataPoints
      }]
  }

    return <div className="graphs gm-content">
      <CanvasJSChart options = {options}
		/* onRef = {ref => this.chart = ref} */
		/>
    </div>
  }
}