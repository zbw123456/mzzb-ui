import React from 'react';
import RbTable from 'react-bootstrap/lib/Table';

interface BaseRow {
  id: number
}

export interface ICol<IRow> {
  key: string
  title: string
  format: (row: IRow, idx: number) => React.ReactNode
}

interface IProps<IRow> {
  rows?: IRow[]
  cols: ICol<IRow>[]
  title?: string
  sortRow?: (a: IRow, b: IRow) => number
}

export default function Table<IRow extends BaseRow>(props: IProps<IRow>) {
  if (!props.rows) {
    return null
  }
  if (props.sortRow) {
    props.rows.sort(props.sortRow)
  }
  const { rows, cols, title } = props
  return (
    <RbTable bordered={true} striped={true} hover={true}>
      {title && <caption>{props.title}</caption>}
      <thead>
        <tr>
          {cols.map(col => (
            <th key={col.key} className={col.key}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.id} id={`row-${row.id}`}>
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
