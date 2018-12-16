import React from 'react';
import RbTable from 'react-bootstrap/lib/Table';

interface IRow {
  key: string
}

export interface ICol<R extends IRow> {
  key: string
  title: string
  format: (row: R, idx: number) => React.ReactNode
}

interface IProps<R extends IRow> {
  rows?: R[]
  cols: ICol<R>[]
  sortRow?: (a: R, b: R) => number
}

function Table<R extends IRow>(props: IProps<R>) {
  if (!props.rows) {
    return null
  }
  const rows = props.rows.sort(props.sortRow)
  const cols = props.cols
  return (
    <RbTable bordered={true} striped={true} hover={true}>
      <thead>
        <tr>
          {cols.map(col => <th key={col.key}>{col.title}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.key}>
            {cols.map((col) => (
              <td key={col.key}>{col.format(row, idx)}</td>
            ))}
          </tr>
        ))
        }
      </tbody>
    </RbTable>
  )
}

export default Table
