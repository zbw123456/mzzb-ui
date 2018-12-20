import React from 'react';
import RbTable from 'react-bootstrap/lib/Table';

interface BaseRow {
  key: string
}

export interface ICol<IRow> {
  key: string
  title: string
  format: (row: IRow, idx: number) => React.ReactNode
}

interface IProps<IRow> {
  rows?: IRow[]
  cols: ICol<IRow>[]
  sortRow?: (a: IRow, b: IRow) => number
}

export default function Table<IRow extends BaseRow>(props: IProps<IRow>) {
  if (!props.rows) {
    return null
  }
  const rows = props.rows.sort(props.sortRow)
  const cols = props.cols
  return (
    <RbTable bordered={true} striped={true} hover={true}>
      <thead>
        <tr>
          {cols.map(col => (
            <th key={col.key} className={col.key}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.key}>
            {cols.map((col) => (
              <td key={col.key} className={col.key}>{col.format(row, idx)}</td>
            ))}
          </tr>
        ))
        }
      </tbody>
    </RbTable>
  )
}
