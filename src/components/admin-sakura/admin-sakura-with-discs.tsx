import * as React from 'react'
import { DiscModel, SakuraOfDiscsModel } from './reducer-discs'
import { formatTimeout } from '../../utils/format'
import { Button, Input, Modal } from 'antd'
import { Column, Table } from '../../lib/table'
import { Command } from '../../lib/command'

interface FormSearch {
  asin?: string
}

const formSearch: FormSearch = {}

interface Props {
  detail: SakuraOfDiscsModel
  search?: DiscModel[]
  pushDiscs: (id: number, pid: number) => void
  dropDiscs: (id: number, pid: number) => void
  searchDisc: (id: number, asin: string) => void
  toViewDisc: (t: DiscModel) => void
}

export function AdminSakuraDiscs(props: Props) {

  function searchDisc() {
    const asin = formSearch.asin

    if (!asin) {
      Modal.warning({title: '请检查输入项', content: `碟片ASIN必须输入`})
      return
    }

    props.searchDisc(props.detail.id, asin)
  }

  function getColumns(extraColumn: Column<DiscModel>): Column<DiscModel>[] {
    return [
      {
        key: 'asin',
        title: 'ASIN',
        format: (t) => t.asin
      },
      {
        key: 'surplusDays',
        title: '天数',
        format: (t) => `${t.surplusDays}天`
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => <Command onClick={() => props.toViewDisc(t)}>{t.title}</Command>
      },
      extraColumn
    ]
  }

  function getPushControl() {
    const pushDisc = (t: DiscModel) => () => props.pushDiscs(props.detail.id, t.id)
    return {
      key: 'control',
      title: '功能',
      format: (t: DiscModel) => <Command onClick={pushDisc(t)}>添加</Command>
    }
  }

  function getDropControl() {
    const dropDisc = (t: DiscModel) => () => props.dropDiscs(props.detail.id, t.id)
    return {
      key: 'control',
      title: '功能',
      format: (t: DiscModel) => <Command onClick={dropDisc(t)}>移除</Command>
    }
  }

  return (
    <div className="admin-sakura-discs-content">
      <div>
        <div className="input-wrapper">
          <Input
            addonBefore="ASIN"
            defaultValue={formSearch.asin}
            onChange={e => formSearch.asin = e.target.value}
            placeholder="请输入ASIN"
          />
        </div>
        <div className="input-wrapper">
          <Button onClick={searchDisc}>提交</Button>
        </div>
      </div>
      {props.search && (
        <Table
          title="待选碟片"
          rows={props.search}
          columns={getColumns(getPushControl())}
        />
      )}
      <Table
        title={props.detail.title}
        subtitle={formatTimeout(props.detail.modifyTime)}
        rows={props.detail.discs}
        columns={getColumns(getDropControl())}
      />
    </div>
  )
}
