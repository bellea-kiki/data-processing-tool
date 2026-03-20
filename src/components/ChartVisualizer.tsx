import React from 'react'
import { Line, Bar, Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import './ChartVisualizer.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ChartVisualizerProps {
  data: Record<string, string | number>[]
  columns: string[]
  chartType: string
  xAxis: string
  yAxis: string
  groupByColumn: string
  onChartTypeChange: (type: string) => void
  onXAxisChange: (col: string) => void
  onYAxisChange: (col: string) => void
  onGroupByChange: (col: string) => void
}

const ChartVisualizer: React.FC<ChartVisualizerProps> = ({
  data,
  columns,
  chartType,
  xAxis,
  yAxis,
  groupByColumn,
  onChartTypeChange,
  onXAxisChange,
  onYAxisChange,
  onGroupByChange,
}) => {
  // 定义颜色集合，用于不同的数据线（更鲜艳的颜色）
  const colors = [
    { border: 'rgb(0, 150, 150)', fill: 'rgba(0, 150, 150, 0.1)' },
    { border: 'rgb(255, 50, 50)', fill: 'rgba(255, 50, 50, 0.1)' },
    { border: 'rgb(0, 100, 220)', fill: 'rgba(0, 100, 220, 0.1)' },
    { border: 'rgb(220, 150, 0)', fill: 'rgba(220, 150, 0, 0.1)' },
    { border: 'rgb(150, 0, 220)', fill: 'rgba(150, 0, 220, 0.1)' },
    { border: 'rgb(0, 180, 80)', fill: 'rgba(0, 180, 80, 0.1)' },
    { border: 'rgb(220, 80, 150)', fill: 'rgba(220, 80, 150, 0.1)' },
    { border: 'rgb(100, 150, 0)', fill: 'rgba(100, 150, 0, 0.1)' },
  ]

  // 生成图表数据
  const generateChartData = () => {
    if (!xAxis || !yAxis) {
      return { datasets: [] }
    }

    // 获取 X 轴的所有唯一值
    const xValuesSet = new Set(data.map(row => row[xAxis]))
    const xValuesArray = Array.from(xValuesSet)
    
    // 对 X 轴值进行排序（如果是数字则数字排序，否则字符串排序）
    const xValues = xValuesArray.sort((a, b) => {
      const aNum = Number(a)
      const bNum = Number(b)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum
      }
      return String(a).localeCompare(String(b))
    })
    
    let datasets: any[] = []

    if (groupByColumn) {
      // 按分组列分组
      const groupedData = new Map<string | number, Record<string, string | number>[]>()
      data.forEach(row => {
        const groupKey = row[groupByColumn]
        if (!groupedData.has(groupKey)) {
          groupedData.set(groupKey, [])
        }
        groupedData.get(groupKey)!.push(row)
      })

      // 为每个分组创建一条曲线
      let colorIndex = 0
      groupedData.forEach((groupData, groupKey) => {
        const points = xValues.map(xVal => {
          const y = groupData.find(row => row[xAxis] === xVal)?.[yAxis] || null
          const x = Number(xVal)
          return { x, y }
        })

        datasets.push({
          label: `${groupByColumn}: ${groupKey}`,
          data: points,
          borderColor: colors[colorIndex % colors.length].border,
          backgroundColor: colors[colorIndex % colors.length].fill,
          borderWidth: 4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBorderWidth: 2,
          pointBorderColor: '#fff',
          pointBackgroundColor: colors[colorIndex % colors.length].border,
          tension: 0.3,
          fill: false,
          showLine: true,
          spanGaps: true,
        })
        colorIndex++
      })
    } else {
      // 没有分组时，直接显示单条曲线
      const points = xValues.map(xVal => {
        const y = data.find(row => row[xAxis] === xVal)?.[yAxis] || null
        const x = Number(xVal)
        return { x, y }
      })

      datasets.push({
        label: yAxis,
        data: points,
        borderColor: colors[0].border,
        backgroundColor: colors[0].fill,
        borderWidth: 4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBorderColor: '#fff',
        pointBackgroundColor: colors[0].border,
        tension: 0.3,
        fill: false,
        showLine: true,
        spanGaps: true,
      })
    }

    return { datasets }
  }

  const chartData = generateChartData()

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            weight: 700 as any,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: groupByColumn 
          ? `${yAxis} vs ${xAxis} (按 ${groupByColumn} 分组)`
          : `${yAxis} vs ${xAxis}`,
        font: {
          size: 14,
          weight: 700 as any,
        },
        padding: 20,
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: true,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return String(value)
          },
        },
        parseFloat: true,
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          drawBorder: true,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: any) {
            // 只显示整数
            if (Number.isInteger(value)) {
              return String(value)
            }
            return ''
          },
        },
      },
    },
  }

  const renderChart = () => {
    if (!xAxis || !yAxis) {
      return <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>请选择 X 轴和 Y 轴</div>
    }

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} />
      case 'scatter':
        return <Scatter data={chartData} options={options} />
      case 'line':
      default:
        return <Line data={chartData} options={options} />
    }
  }

  return (
    <div className="chart-visualizer">
      <h2>📈 数据可视化</h2>
      
      <div className="chart-controls">
        <div className="control-group">
          <label>图表类型：</label>
          <select value={chartType} onChange={(e) => onChartTypeChange(e.target.value)}>
            <option value="line">折线图</option>
            <option value="bar">柱状图</option>
            <option value="scatter">散点图</option>
          </select>
        </div>

        <div className="control-group">
          <label>X 轴：</label>
          <select value={xAxis} onChange={(e) => onXAxisChange(e.target.value)}>
            <option value="">-- 选择 X 轴 --</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Y 轴：</label>
          <select value={yAxis} onChange={(e) => onYAxisChange(e.target.value)}>
            <option value="">-- 选择 Y 轴 --</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>分组变量（可选）：</label>
          <select value={groupByColumn} onChange={(e) => onGroupByChange(e.target.value)}>
            <option value="">-- 不分组 --</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  )
}

export default ChartVisualizer
