import React, { useState } from 'react';
import RbTable from 'react-bootstrap/lib/Table';
import classNames from 'classnames';
import './Table.scss';

interface BaseRow {
  id: number
}

export interface ICol<IRow> {
  key: string
  title: string
  format: (row: IRow, idx: number) => React.ReactNode
  tdClass?: (t: IRow) => string
  compare?: (a: IRow, b: IRow) => number
}

interface IProps<IRow> {
  mark: string
  rows: IRow[]
  cols: ICol<IRow>[]
  title?: string
  trClass?: (t: IRow) => string
  sortRow?: (a: IRow, b: IRow) => number
}

interface IState {
  sortKey?: string
  sortAsc?: boolean
}

export default function Table<IRow extends BaseRow>(props: IProps<IRow>) {
  const { mark, rows, cols, title, trClass, sortRow } = props
  const [state, setState] = useState<IState>(() => {
    const stateText = sessionStorage[`table-state-${mark}`]
    return stateText ? JSON.parse(stateText) : {}
  })

  if (state.sortKey) {
    const sortCol = cols.find(col => col.key === state.sortKey)
    if (sortCol) {
      rows.sort(sortCol.compare)
    }
    if (state.sortAsc === false) {
      rows.reverse()
    }
  } else if (sortRow) {
    rows.sort(sortRow)
  }

  return (
    <RbTable bordered={true} striped={true} hover={true}>
      {title && <caption>{props.title}</caption>}
      <thead>
        <tr>
          {cols.map(col => (
            <th
              key={col.key}
              children={col.title}
              onClick={thClick(col)}
              className={thClass(col)}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.id} id={`row-${row.id}`} className={trClass && trClass(row)}>
            {cols.map((col) => (
              <td key={col.key} className={tdClass(col, row)}>
                {col.format(row, idx)}
              </td>
            ))}
          </tr>
        ))
        }
      </tbody>
    </RbTable>
  )

  function doSort(col: ICol<IRow>) {
    let nextState
    if (state.sortKey === col.key) {
      nextState = { ...state, sortAsc: state.sortAsc !== true }
    } else {
      nextState = { ...state, sortAsc: true, sortKey: col.key }
    }
    sessionStorage[`table-state-${mark}`] = JSON.stringify(nextState)
    setState(nextState)
  }

  function thClass(col: ICol<IRow>) {
    return classNames(col.key, {
      sortable: col.compare !== undefined,
      asc: state.sortKey === col.key && state.sortAsc === true,
      desc: state.sortKey === col.key && state.sortAsc === false,
    })
  }

  function thClick(col: ICol<IRow>) {
    return col.compare && (() => doSort(col))
  }

  function tdClass(col: ICol<IRow>, row: IRow) {
    return classNames(col.key, col.tdClass && col.tdClass(row))
  }
}
