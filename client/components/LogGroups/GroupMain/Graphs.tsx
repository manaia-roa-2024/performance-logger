import { Component, ContextType, ReactNode } from "react"
import CanvasJSReact from '@canvasjs/react-charts'
import { LogGroupContext } from "../LGContext";
import SimpleDateInput from "../../SimpleForm/Inputs/SimpleDateInput";
import { MetricHandler } from "../../../../models/classes/MetricHandler";
import Util from "../../../../Util";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Graphs extends Component{

  static contextType = LogGroupContext;

  context!: ContextType<typeof LogGroupContext>

  completeLineGraph(){ // line graph using all data points
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

    return options
  }

  groupedBarChart(){ // bar chart for grouped data
    const logGroup = this.context.logGroup


    const dataPoints = this.context.groupData.map((gd, i, arr) =>{
      //const mean = Number(gd.mean.split(' ')[0])
      const x = arr.length - i
      const y = logGroup.getLineGraphValue(gd.mean!)

      const toolTipRow = (key: string, value: string | number, className="") =>{
        return `
        <div class="tool-tip-row">
          <div>${key}</div>
          <div>${value}</div>
        </div>`
      }

      const ds = new Date(gd.dateStart)
      const de = new Date(gd.dateEnd)

      /*const rangeStr = logGroup.groupBy === 'month' ? `${ds.getDate()} ${Util.shortHandMonths[ds.getMonth()]} ${ds.getFullYear()} to ${de.getDate()} ${Util.shorthandMonths[de.getMonth()]} ${de.getFullYear()}`
        : `${gd.dateStart} to ${gd.dateEnd}`*/

      const rangeStr = logGroup.groupBy === 'month' ? `${Util.longHandMonths[ds.getMonth()]} ${ds.getFullYear()}` : `${gd.dateStart}&nbsp;&nbsp;to&nbsp;&nbsp;${gd.dateEnd}`

      const toolTipContent = 
      `
      <div class="tooltip-group">
        <div class='tac'>${rangeStr}</div>
        ${toolTipRow('Records', gd.records)}
        ${toolTipRow('Average', logGroup.getConvertedValueBlacklist(gd.mean!))}
        ${toolTipRow('Median', logGroup.getConvertedValueBlacklist(gd.median!))}
        ${toolTipRow('Min', logGroup.getConvertedValueBlacklist(gd.min!))}
        ${toolTipRow('Max', logGroup.getConvertedValueBlacklist(gd.max!))}
      </div>
      
      `;

      return {
        x,
        y,
        label: x,
        toolTipContent
      }
    })

    let min = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER

    for (const gd of this.context.groupData){
      min = Math.min(min, gd.mean!)
      max = Math.max(max, gd.mean!)
    }
    min = logGroup.getLineGraphValue(min)
    max = logGroup.getLineGraphValue(max)

    const minimum = min - Math.abs(0.025 * min)
    const maximum = logGroup.getLineGraphValue(max)


    const options = {
      theme: "light2",
      title: {
        text: "Trend"
      },
      axisY: {
        title: 'Average ' + (logGroup.unit === 'unit' ? '' : (`${MetricHandler.getMetricAlias(logGroup.metric)} (${MetricHandler.getCode(logGroup.metric, logGroup.unit)})`)),
        labelFormatter: (e: {value: number}) =>{
          return logGroup.convertGraphValue(e.value)
        },
        minimum: this.context.groupData.length > 0 ? minimum : undefined,
      },
      data: [{
        type: 'column',
        dataPoints
      }]
    }

    return options
  }

  render(): ReactNode {

    const logGroup = this.context.logGroup

    const options = logGroup.groupBy === 'none' ? this.completeLineGraph() : this.groupedBarChart()

    return <div className="graphs gm-content">
      <CanvasJSChart options = {options}
		/* onRef = {ref => this.chart = ref} */
		/>
    </div>
  }
}