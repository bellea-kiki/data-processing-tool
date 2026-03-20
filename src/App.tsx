import { useState } from 'react'
import './App.css'
import TableImporter from './components/TableImporter'
import TableDisplay from './components/TableDisplay'
import ChartVisualizer from './components/ChartVisualizer'

interface DataRow {
  [key: string]: string | number
}

function App() {
  const [data, setData] = useState<DataRow[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [selectedChartType, setSelectedChartType] = useState('line')
  const [selectedXAxis, setSelectedXAxis] = useState<string>('')
  const [selectedYAxis, setSelectedYAxis] = useState<string>('')
  const [groupByColumn, setGroupByColumn] = useState<string>('')

  const handleDataImport = (importedData: DataRow[], importedColumns: string[]) => {
    setData(importedData)
    setColumns(importedColumns)
    
    if (importedColumns.length > 0) {
      // 尝试保持之前的坐标轴选择
      // 如果新列包含之前选择的 X 轴，则保留；否则选择第一列
      setSelectedXAxis(prev => 
        importedColumns.includes(prev) ? prev : importedColumns[0]
      )
      
      // 如果新列包含之前选择的 Y 轴，则保留；否则选择第二列或第一列
      setSelectedYAxis(prev => 
        importedColumns.includes(prev) 
          ? prev 
          : importedColumns.length > 1 ? importedColumns[1] : importedColumns[0]
      )
      
      // 如果新列包含之前选择的分组列，则保留；否则选择第三列或清空
      setGroupByColumn(prev => 
        importedColumns.includes(prev) 
          ? prev 
          : importedColumns.length > 2 ? importedColumns[2] : ''
      )
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📊 数据处理工具</h1>
        <p>导入数据、查看表格、生成可视化</p>
      </header>

      <div className="main-content">
        <div className="panel import-panel">
          <TableImporter onDataImport={handleDataImport} />
        </div>

        {data.length > 0 && (
          <>
            <div className="panel table-panel">
              <TableDisplay data={data} columns={columns} />
            </div>

            <div className="panel chart-panel">
              <ChartVisualizer
                data={data}
                columns={columns}
                chartType={selectedChartType}
                xAxis={selectedXAxis}
                yAxis={selectedYAxis}
                groupByColumn={groupByColumn}
                onChartTypeChange={setSelectedChartType}
                onXAxisChange={setSelectedXAxis}
                onYAxisChange={setSelectedYAxis}
                onGroupByChange={setGroupByColumn}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
