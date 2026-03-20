import React, { useRef } from 'react'
import './TableImporter.css'

interface TableImporterProps {
  onDataImport: (data: Record<string, string | number>[], columns: string[]) => void
}

const TableImporter: React.FC<TableImporterProps> = ({ onDataImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const lines = content.trim().split('\n')
        
        if (lines.length < 2) {
          alert('CSV 文件至少需要一行头部和一行数据')
          return
        }

        const headers = lines[0].split(',').map(h => h.trim())
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim())
          const row: Record<string, string | number> = {}
          headers.forEach((header, index) => {
            const value = values[index]
            row[header] = isNaN(Number(value)) ? value : Number(value)
          })
          return row
        })

        onDataImport(data, headers)
        
        // 重置文件输入框，允许再次选择同一文件
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        alert('文件解析失败: ' + error)
      }
    }
    reader.readAsText(file)
  }

  const handleManualInput = () => {
    const input = prompt('请输入 CSV 格式的数据（首行为列名）：', 'Date,Sales,Visits\n2024-01-01,100,50\n2024-01-02,150,75')
    if (input) {
      const lines = input.trim().split('\n')
      if (lines.length < 2) {
        alert('数据至少需要一行头部和一行数据')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const row: Record<string, string | number> = {}
        headers.forEach((header, index) => {
          const value = values[index]
          row[header] = isNaN(Number(value)) ? value : Number(value)
        })
        return row
      })

      onDataImport(data, headers)
      
      // 手动输入后清空，允许再次输入
    }
  }

  return (
    <div className="table-importer">
      <h2>📁 导入数据</h2>
      <div className="import-buttons">
        <button 
          className="btn btn-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          📤 上传 CSV 文件
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleManualInput}
        >
          ✏️ 手动输入数据
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <p className="hint">支持 CSV 格式，首行为列名</p>
    </div>
  )
}

export default TableImporter
