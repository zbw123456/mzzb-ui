import React, { useState } from 'react';
import RbTable from 'react-bootstrap/lib/Table';
import Button from 'antd/lib/button';
import CheckBox from 'antd/lib/checkbox';
import message from 'antd/lib/message';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import immer from 'immer';
import './Table.scss';

export default function Table<IRow extends BaseRow>(props: IProps<IRow>) {
  const { mark, rows, cols, title, trClass, sortRow, copyFmt } = props
  const [state, setState] = useState<IState>(() => {
    const stateText = sessionStorage[`table-state-${mark}`]
    const loadState = JSON.parse(stateText || '{}');
    return { ...loadState, copyMode: false, selected: new Set() }
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

  const buttons = state.copyMode ? copyButtons() : viewButtons();

  return (
    <div className="table-warpper">
      <div className="table-caption">
        <span className="table-title">{title}</span>
        <span className="table-buttons">{buttons}</span>
      </div>
      <RbTable bordered={true} striped={true} hover={true}>
        <thead>
          <tr>
            {state.copyMode && (
              <th className="select">
                <CheckBox onChange={e => doSelectAll(e.target.checked)} />
              </th>
            )}
            {cols.map(col => (
              <th
                key={col.key}
                children={col.title}
                className={thClass(col)}
                onClick={col.compare && (() => doClickTh(col))}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id}
              id={`row-${row.id}`}
              className={trClass && trClass(row)}
              onClick={() => state.copyMode && doToggleRow(row.id)}
            >
              {state.copyMode && (
                <td className="select">
                  <CheckBox checked={state.selected.has(row.id)} />
                </td>
              )}
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
    </div>
  )

  function viewButtons() {
    return (
      <Button.Group>
        <Button onClick={() => setCopyMode(true)}>复制模式</Button>
      </Button.Group >
    )
  }

  function copyButtons() {
    return (
      <Button.Group>
        <Button onClick={doCopy}>复制</Button>
        <Button onClick={() => setCopyMode(false)}>取消</Button>
      </Button.Group>
    )
  }

  function setCopyMode(copyMode: boolean) {
    setState(immer(state, draft => {
      draft.copyMode = copyMode
    }))
  }

  function doCopy() {
    let text = '', idx = 0
    state.selected.forEach(id => {
      text += copyFmt!(rows.find(row => row.id === id)!, idx++) + '\n'
    })
    if (copy(text)) {
      message.success('已复制到剪贴板')
    } else {
      message.success('复制失败')
    }
    setCopyMode(false)
  }

  function doToggleRow(id: number) {
    doSelectRow(id, !state.selected.has(id))
  }

  function doSelectRow(id: number, checked: boolean) {
    console.log(id, checked)
    if (checked) {
      setState(immer(state, draft => {
        draft.selected.add(id)
      }))
    } else {
      setState(immer(state, draft => {
        draft.selected.delete(id)
      }))
    }
  }

  function doSelectAll(checked: boolean) {
    if (checked) {
      setState(immer(state, draft => {
        draft.selected = new Set(rows.map(row => row.id))
      }))
    } else {
      setState(immer(state, draft => {
        draft.selected = new Set()
      }))
    }
  }

  function doClickTh(col: ICol<IRow>) {
    const next = immer(state, draft => {
      if (state.sortKey === col.key) {
        draft.sortAsc = state.sortAsc !== true
      } else {
        draft.sortAsc = true
        draft.sortKey = col.key
      }
    })
    setState(next)
    sessionStorage[`table-state-${mark}`] = JSON.stringify(next)
  }

  function thClass(col: ICol<IRow>) {
    return classNames(col.key, {
      sortable: col.compare !== undefined,
      asc: state.sortKey === col.key && state.sortAsc === true,
      desc: state.sortKey === col.key && state.sortAsc === false,
    })
  }

  function tdClass(col: ICol<IRow>, row: IRow) {
    return classNames(col.key, col.tdClass && col.tdClass(row))
  }
}

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
  copyFmt?: (t: IRow, i: number) => String
}

interface IState {
  sortKey?: string
  sortAsc?: boolean
  copyMode: boolean
  selected: Set<number>
}
