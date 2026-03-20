import React from 'react'
import './TableDisplay.css'

interface TableDisplayProps {
  data: Record<string, string | number>[]
  columns: string[]
}

const TableDisplay: React.FC<TableDisplayProps> = ({ data, columns }) => {
  return (
    <div className="table-display">
      <h2>📋 数据表格</h2>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={`${index}-${col}`}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="data-info">共 {data.length} 行数据</p>
    </div>
  )
}

export default TableDisplay
