import { Component, ContextType, ReactNode } from "react"
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
      const x = date
      const y = Number(lr.getLineGraphValue())
      const toolTipContent = `<span data-color="#6D78AD" style="color:rgb(109,120,173);">${SimpleDateInput.toISODate(date)}:</span>&nbsp;&nbsp;${lr.getConvertedValue()}`
      return {
        x,
        y,
        label: SimpleDateInput.toISODate(date),
        indexLabel: undefined,
        toolTipContent: toolTipContent,
      }
    })

    //console.log(dataPoints)

    //const CanvasJS = CanvasJSReact.CanvasJS;
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;


    /*color: rgb(109, 120, 173);*/
    //#6D78AD
    const options = {
      theme: "light2",
      title: {
          text: "Trend"
      },
      axisY: {
        title: logGroup.unit === 'unit' ? undefined : (`${MetricHandler.getMetricAlias(logGroup.metric)} (${MetricHandler.getCode(logGroup.metric, logGroup.unit)})`),
        labelFormatter: function(e: {value: number}){
          return logGroup.convertGraphValue(e.value)
        }
      },
      /*toolTip:{
        contentFormatter: function(e){
          const str = ""
          console.log(e)
          return 'abc'
        }
      },*/
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