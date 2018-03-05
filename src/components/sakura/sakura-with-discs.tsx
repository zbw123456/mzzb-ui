import * as React from 'react'
import { DiscModel, SakuraModel, SakuraOfDiscsModel } from './reducer'
import { Column, Table } from '../../lib/table'
import { Timer } from '../../lib/timer'
import { formatNumber } from '../../utils/format'
import { Command } from '../../lib/command'

interface Props {
  detail: SakuraOfDiscsModel
  toViewDisc: (t: DiscModel) => void
}

export function SakuraDiscs(props: Props) {

  function getColumns(): Column<DiscModel>[] {
    return [
      {
        key: 'rank',
        title: '日亚排名',
        format: (t) => formatRank(t)
      },
      {
        key: 'totalPt',
        title: '累积PT',
        format: (t) => `${(t.totalPt || '----')} pt`
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => <Command onClick={() => props.toViewDisc(t)}>{t.title}</Command>
      },
    ]
  }

  function formatRank(t: DiscModel) {
    const thisRank = t.thisRank ? formatNumber(t.thisRank, '****') : '----'
    const prevRank = t.prevRank ? formatNumber(t.prevRank, '****') : '----'
    return `${thisRank}位/${prevRank}位`
  }

  function formatModifyTime(sakura: SakuraModel) {
    if (sakura.modifyTime) {
      return (
        <Timer
          time={sakura.modifyTime}
          timeout={1000}
          render={(state => `${state.hour}时${state.minute}分${state.second}秒前`)}
        />
      )
    } else {
      return '从未更新'
    }
  }

  return (
    <div className="sakura-discs-content">
      <Table
        key={props.detail.id}
        title={props.detail.title}
        subtitle={formatModifyTime(props.detail)}
        rows={props.detail.discs}
        columns={getColumns()}
      />
    </div>
  )
}