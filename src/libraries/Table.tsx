import React, { useState } from 'react';
import Button from 'antd/lib/button';
import CheckBox from 'antd/lib/checkbox';
import message from 'antd/lib/message';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import immer from 'immer';
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
  handler?: { refresh: () => void, loading: boolean }
  trClass?: (t: IRow) => string
  copyFmt?: (t: IRow, i: number) => String
  defaultSort?: ((a: IRow, b: IRow) => number)
}

interface IState {
  sortKey?: string
  sortAsc?: boolean
  copyMode: boolean
  selected: Set<number>
}

export default function Table<IRow extends BaseRow>(props: IProps<IRow>) {
  const { mark, rows, cols, title, handler, trClass, copyFmt, defaultSort } = props
  const [state, setState] = useState<IState>(() => {
    return loadState(mark, { copyMode: false, selected: new Set() })
  })
  const { sortKey, sortAsc, copyMode, selected } = state

  applySort()

  return (
    <div className="table-warpper">
      {(title || copyFmt || handler) && renderCaption()}
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            {copyMode && renderSelectTh()}
            {cols.map(col => (
              <th
                key={col.key}
                children={col.title}
                className={thClass(col)}
                onClick={col.compare && (() => thClick(col))}
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
              onClick={() => copyMode && doToggleRow(row.id)}
            >
              {copyMode && renderSelectTd(row.id)}
              {cols.map((col) => (
                <td key={col.key} className={tdClass(col, row)}>
                  {col.format(row, idx)}
                </td>
              ))}
            </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  )

  function renderSelectTh() {
    return (
      <th className="select">
        <CheckBox
          checked={selected.size === rows.length}
          onChange={e => doSelectAll(e.target.checked)}
        />
      </th>
    )
  }

  function renderSelectTd(rowId: number) {
    return (
      <td className="select">
        <CheckBox checked={selected.has(rowId)} />
      </td>
    )
  }

  function renderCaption() {
    return (
      <div className="table-caption">
        {title && (
          <span className="table-title">{title}</span>
        )}
        {copyFmt && (
          <span className="table-buttons">
            {!copyMode ? renderViewButtons() : renderCopyButtons()}
          </span>
        )}
        {handler && (
          <span className="table-buttons">
            <Button.Group>
              <Button onClick={handler.refresh} loading={handler.loading}>刷新数据</Button>
            </Button.Group>
          </span>
        )}
      </div>
    )
  }

  function renderViewButtons() {
    return (
      <Button.Group>
        <Button onClick={() => setCopyMode(true)}>复制排名</Button>
      </Button.Group>
    )
  }

  function renderCopyButtons() {
    return (
      <Button.Group>
        <Button onClick={doCopy}>复制</Button>
        <Button onClick={() => setCopyMode(false)}>取消</Button>
      </Button.Group>
    )
  }

  function applySort() {
    if (sortKey) {
      const findCol = cols.find(col => col.key === sortKey)
      if (findCol && findCol.compare) {
        const compare = findCol.compare
        rows.sort((a, b) => {
          return sortAsc ? compare(a, b) : -compare(a, b)
        })
      }
    } else if (defaultSort) {
      rows.sort(defaultSort)
    }
  }

  function setCopyMode(copyMode: boolean) {
    update(draft => {
      draft.copyMode = copyMode
    })
  }

  function doCopy() {
    let text = '', idx = 0
    selected.forEach(id => {
      text += copyFmt!(rows.find(row => row.id === id)!, idx++) + '\n'
    })
    if (copy(text)) {
      message.success('已复制到剪贴板')

    } else {
      message.success('复制失败')
    }
  }

  function doToggleRow(id: number) {
    doSelectRow(id, !selected.has(id))
  }

  function doSelectRow(id: number, checked: boolean) {
    update(draft => {
      if (checked) {
        draft.selected.add(id)
      } else {
        draft.selected.delete(id)
      }
    })
  }

  function doSelectAll(checked: boolean) {
    update(draft => {
      if (checked) {
        draft.selected = new Set(rows.map(row => row.id))
      } else {
        draft.selected = new Set()
      }
    })
  }

  function thClick(col: ICol<IRow>) {
    update(draft => {
      if (sortKey === col.key) {
        draft.sortAsc = draft.sortAsc !== true
      } else {
        draft.sortAsc = true
        draft.sortKey = col.key
      }
    })
  }

  function thClass(col: ICol<IRow>) {
    return classNames(col.key, {
      sortable: col.compare !== undefined,
      asc: sortKey === col.key && sortAsc === true,
      desc: sortKey === col.key && sortAsc === false,
    })
  }

  function tdClass(col: ICol<IRow>, row: IRow) {
    return classNames(col.key, col.tdClass && col.tdClass(row))
  }

  function update(updater: (draft: IState) => void) {
    const nextState = immer(state, updater)
    setState(nextState)
    saveState(mark, nextState)
  }
}

function saveState(mark: string, state: IState) {
  const saveState = { ...state, selected: [...state.selected] }
  sessionStorage[`table-state-${mark}`] = JSON.stringify(saveState)
}

function loadState(mark: string, initState: IState): IState {
  const stateText = sessionStorage[`table-state-${mark}`]
  const loadState = JSON.parse(stateText || '{}')
  const nextState = { ...initState, ...loadState }
  if (Array.isArray(loadState.selected)) {
    nextState.selected = new Set(loadState.selected)
  }
  return nextState
}
