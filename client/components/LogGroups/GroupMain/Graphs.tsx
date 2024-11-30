import { Component, ContextType, ReactNode } from "react"
import CanvasJSReact from '@canvasjs/react-charts'
import { LogGroupContext } from "../LGContext";
import Util from "../../../../Util";
import LogGroup from "../../../../models/classes/LogGroup";
import { format, parseISO } from "date-fns";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Graphs extends Component{

  static contextType = LogGroupContext;

  context!: ContextType<typeof LogGroupContext>

  removeCanvasJSLink(){
    const link = document.querySelector(`#log-graph-${this.context.logGroup.id} .canvasjs-chart-credit`)
    if (link)
      link.remove()
  }

  componentDidMount(): void {
    this.removeCanvasJSLink()
  }

  componentDidUpdate(): void {
    this.removeCanvasJSLink()
  }

  //1743375600000 max
  //1732921200000 min

  emptyGraph(){
    const options = {
      theme: "light2",
      title: {
          text: "Trend"
      },
      axisY: {
        title: this.context.logGroup.getYLabel(),
      },
      axisX: {
        title: 'Date',
      },
      data: [{type: 'line',
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "#,##0.00",}]
    }
    return options
  }

  completeLineGraph(){ // line graph using all data points
    const logGroup = this.context.logGroup

    if (logGroup.logRecords.length === 0)
      return this.emptyGraph()


    let totalUnits: number = 1

    const lastMs = new Date(logGroup.logRecords[0].date).getTime() + 8.64e+7
    const firstMs = new Date(logGroup.logRecords[logGroup.logRecords.length-1].date).getTime() - 8.64e+7
    totalUnits = (lastMs - firstMs) / 1000 / 60 / 60 / 24

    const interval = Math.ceil(totalUnits / 5)

    const dataPoints = logGroup.logRecords.map((lr, i) =>{
      const date = parseISO(lr.date)
      const x = date
      const y = Number(lr.getLineGraphValue())
      const toolTipContent = `<span data-color="#6D78AD" style="color:rgb(109,120,173);">${LogGroup.standardDate(date)}:</span>&nbsp;&nbsp;${lr.logGroup.getConvertedValueBlacklist(lr.value)}`
      return {
        x,
        y,
        /*label: format(date, 'MMM dd yyyy'),*/
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
        title: logGroup.getYLabel(),
        labelFormatter: function(e: {value: number}){
          return logGroup.convertGraphValue(e.value)
        }
      },
      axisX: {
        title: 'Date',
        labelFormatter: function(e){
          if (e.value instanceof Date){
            return format(e.value, 'dd MMM yyyy')
          }
        },
        minimum: firstMs,
        maximum: lastMs,
        intervalType: 'day',
        interval: interval,//Math.max(Math.floor(logGroup.logRecords.length / 5), 1),
        labelAngle: -30
      },

      data: [{
          type: logGroup.graphType,
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

      const toolTipRow = (key: string, value: string | number) =>{
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

      const monthText = Util.toMonthAndYear(ds)
      const rangeStr = logGroup.groupBy === 'month' ? monthText : `${LogGroup.standardDate(ds)}&nbsp;&nbsp;to&nbsp;&nbsp;${LogGroup.standardDate(de)}`

      const toolTipContent = 
      `
      <div class="tooltip-group">
        <div class='tac'>
          ${logGroup.groupBy === 'week' ? 'Week ' + x : ''}
          <div>${rangeStr}</div>
        </div>
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
        label: logGroup.groupBy === 'month' ? Util.toMonthAndYear(ds, false) : x,
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
   // const maximum = logGroup.getLineGraphValue(max)


    const options = {
      theme: "light2",
      title: {
        text: "Trend"
      },
      axisY: {
        title: 'Average ' + logGroup.getYLabel(),
        labelFormatter: (e: {value: number}) =>{
          return logGroup.convertGraphValue(e.value)
        },
        minimum: this.context.groupData.length > 0 ? minimum : undefined,
      },
      axisX: {
        title: logGroup.groupBy === 'month' ? 'Month' : 'Week Number'
      },
      data: [{
        type: logGroup.graphType,
        dataPoints
      }]
    }

    return options
  }

  render(): ReactNode {
    const logGroup = this.context.logGroup

    const options = logGroup.groupBy === 'none' ? this.completeLineGraph() : this.groupedBarChart()

    return <div id={'log-graph-' + logGroup.id} className={"graphs gm-content"}>
      <CanvasJSChart options = {options}
		/* onRef = {ref => this.chart = ref} */
		/>
    </div>
  }
}