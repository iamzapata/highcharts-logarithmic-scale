import { useRef, useState, ChangeEvent } from "react"
import Highcharts, { setOptions } from "highcharts"
import HighchartsReact from "highcharts-react-official"
import "./App.css"

const INITIAL_Y_AXIS_TYPE = "logarithmic"
const INITIAL_Y_AXIS_TICK_INTERVAL = 1

interface ChartOptions extends Highcharts.Options {}

function generatedData(incrementor: number) {
  let points = []

  for (let i = 1, j = 1; i < 17; i++) {
    points.push([i, j])
    j += Math.trunc(j * incrementor)
  }

  return points
}

const teamAData = generatedData(1.17)
const teamBData = generatedData(1)
console.dir(teamAData)
console.dir(teamBData)

const initialOptions: Highcharts.Options = {
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true,
      },
    },
  },
  chart: {
    width: 800,
    height: 600,
  },
  title: {
    text: "Logarithmic Axis Demo",
  },
  subtitle: {
    text: "Demo of a logarithmic axis in Highcharts",
  },
  yAxis: {
    type: INITIAL_Y_AXIS_TYPE,
    title: {
      text: "commits",
    },
    tickInterval: INITIAL_Y_AXIS_TICK_INTERVAL,
    gridLineWidth: 1,
    opposite: true,
    min: 1,
    max: 100_000,
  },
  xAxis: {
    plotBands: [
      {
        label: {
          text: "Team A",
        },
        color: "orange", // Color value
        from: 3, // Start of the plot band
        to: 6, // End of the plot band
      },
    ],
    plotLines: [
      {
        color: "brown", // Color value
        value: 7, // Value of where the line will appear
        width: 20, // Width of the line
      },
    ],
    title: {
      text: "Weeks",
    },
    tickInterval: 1,
    labels: {
      formatter: function () {
        const ending = this.value === 1 ? "st" : this.value === 2 ? "nd" : "th"
        return this.value + `${ending} Wk`
      },
    },
  },
  series: [
    {
      name: "Customer Services",
      type: "line",
      data: teamAData,
      color: "red",
      dashStyle: "ShortDot",
      zones: [
        {
          value: 5,
          color: "#f7a35c",
        },
        {
          value: 10,
          color: "#7cb5ec",
        },
        {
          value: 15,
          color: "#90ed7d",
        },
      ],
    },
    {
      name: "Infra and Data",
      type: "line",
      data: teamBData,
      color: "violet",
      dashStyle: "LongDash",
    },

    {
      type: "line",
      name: "Check Point",
      color: "goldenrod",
      data: [[15, 85000]],
    },
    {
      type: "line",
      name: "Check Point",
      color: "black",
      data: [[10, 10000]],
    },
  ],
}

type HighchartsYAxisOptions = ChartOptions

interface AxisTypeDropdownProps {
  updateYAxisType: (axisType: Highcharts.AxisTypeValue) => void
  selected: Highcharts.AxisTypeValue
}
function AxisTypeDropdown({ updateYAxisType }: AxisTypeDropdownProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as Highcharts.AxisTypeValue

    if (!["linear", "logarithmic"].includes(type)) {
      throw new Error("yAxis type must be either linear or logarithmic")
    }

    updateYAxisType(type)
  }

  const options = ["linear", "logarithmic"]

  return (
    <label>
      Y-Axis Type:&nbsp; (
      <a
        href={"https://api.highcharts.com/highcharts/yAxis.type"}
        target="_blank"
      >
        yAxis.type
      </a>
      ) &nbsp;
      <select onChange={handleChange} defaultValue={INITIAL_Y_AXIS_TYPE}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option[0].toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </label>
  )
}

/*
  * On a logarithmic axis the numbers along the axis increase logarithmically 
  * and the axis adjusts itself to the data series present in the chart.

  * Note that on logarithmic axes, the tickInterval option is based on powers, 
  * so a tickInterval of 1 means one tick on each of 0.1, 1, 10, 100 etc. 
  * A tickInterval of 2 means a tick of 0.1, 10, 1000 etc. A tickInterval of 0.2 
  * puts a tick on 0.1, 0.2, 0.4, 0.6, 0.8, 1, 2, 4, 6, 8, 10, 20, 40 etc.
 */
interface LogarithmicBaseProps {
  updateYAxisTickInterval: (tickInterval: number) => void
  selectedTickInterval: number
}
function LogarithmicBase({ updateYAxisTickInterval }: LogarithmicBaseProps) {
  const options = [0.2, 0.3, 0.4, 0.5, 1, 2, 3, 4, 5]

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tickInterval = Number(e.target.value)
    updateYAxisTickInterval(tickInterval)
  }

  return (
    <label>
      Log Base:&nbsp; (
      <a
        href={"https://api.highcharts.com/highcharts/yAxis.tickInterval"}
        target="_blank"
      >
        yAxis.tickInterval
      </a>
      )&nbsp;
      <select
        onChange={handleChange}
        defaultValue={INITIAL_Y_AXIS_TICK_INTERVAL}
      >
        {options.map((option) => (
          <option key={"log-base-" + option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function App() {
  const [options, setOptions] = useState<ChartOptions>(initialOptions)
  const [yAxisType, setYAxisType] =
    useState<Highcharts.AxisTypeValue>(INITIAL_Y_AXIS_TYPE)
  const [yAxisTickInterval, setYAxisTickInterval] = useState<number>(
    INITIAL_Y_AXIS_TICK_INTERVAL
  )
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const updateYAxisType = (type: Highcharts.AxisTypeValue) => {
    const newOptions: HighchartsYAxisOptions = { yAxis: { type } }

    setYAxisType(type)
    setOptions(newOptions)
  }

  const updateYAxisTickInterval = (tickInterval: number) => {
    const newOptions: HighchartsYAxisOptions = {
      yAxis: { tickInterval },
    }
    setYAxisTickInterval(tickInterval)
    setOptions(newOptions)
  }

  return (
    <div className="App">
      <h1>📊</h1>
      <p>
        <AxisTypeDropdown
          updateYAxisType={updateYAxisType}
          selected={yAxisType}
        />
        &nbsp;
        {yAxisType === "logarithmic" && (
          <LogarithmicBase
            updateYAxisTickInterval={updateYAxisTickInterval}
            selectedTickInterval={yAxisTickInterval}
          />
        )}
      </p>

      <div className="card">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
        />
      </div>
    </div>
  )
}

export default App
