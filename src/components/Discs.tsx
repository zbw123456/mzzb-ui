import React from 'react';
import DataWarpper from '../libraries/DataWarpper';
import Table, { ICol } from '../libraries/Table';
import { formatNumber } from '../functions/format';
import { compareFactory } from '../functions/compare';
import { IResultHandler } from '../hooks/useGetJson';
import './Discs.scss';

interface IProps {
  mark: string
  result: IResultHandler<IData>
}

export interface IData {
  title: string
  discs: IDisc[]
}

interface IDisc {
  id: number
  asin: string
  title: string
  titlePc?: string
  thisRank?: number
  prevRank?: number
  todayPt?: number
  totalPt?: number
  guessPt?: number
  updateTime?: number
  surplusDays: number
}

export default function Discs({ mark, result }: IProps) {
  return (
    <div className="Discs">
      <DataWarpper
        result={result}
        render={({ title, discs }) => (
          <Table
            mark={`Discs-${mark}`}
            rows={discs}
            cols={getCols()}
            title={title}
            handler={result}
            defaultSort={compareFactory<IDisc, number>({
              apply: disc => disc.thisRank,
              empty: rank => rank === undefined,
              compare: (a, b) => a - b
            })}
            copyFmt={((disc, idx) => {
              let text = `${idx + 1})`
                + ` ${formatRank(disc)}`
                + ` 增${(disc.todayPt || 0)}pt`
                + ` 共${(disc.totalPt || 0)}pt`
                + ` 预${(disc.guessPt || 0)}pt`
                + ` 剩${disc.surplusDays}天`
                + ` [${formatTitle(disc)}]`
              return text;
            })}
          />
        )}
      />
    </div>
  )
}

function getCols(): ICol<IDisc>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (_, idx) => idx + 1,
    },
    {
      key: 'rank',
      title: '日亚排名',
      format: formatRank,
      compare: compareFactory<IDisc, number>({
        apply: disc => disc.thisRank,
        empty: rank => rank === undefined,
        compare: (a, b) => a - b
      }),
      tdClass: rankTdClass
    },
    {
      key: 'addPt',
      title: '日增',
      format: (disc) => `${(disc.todayPt || '----')}点`,
      compare: comparePt(disc => disc.todayPt),
    },
    {
      key: 'sumPt',
      title: '累积',
      format: (disc) => `${(disc.totalPt || '----')}点`,
      compare: comparePt(disc => disc.totalPt),
    },
    {
      key: 'gusPt',
      title: '预测',
      format: (disc) => `${(disc.guessPt || '----')}点`,
      compare: comparePt(disc => disc.guessPt),
    },
    {
      key: 'surp',
      title: '发售',
      format: (disc) => `${disc.surplusDays}天`,
      compare: (a, b) => {
        if (a.surplusDays !== b.surplusDays) {
          return a.surplusDays - b.surplusDays
        }
        return formatTitle(a).localeCompare(formatTitle(b))
      },
    },
    {
      key: 'title',
      title: '碟片标题',
      format: formatTitle,
      compare: (a, b) => formatTitle(a).localeCompare(formatTitle(b)),
    },
  ]
}

function formatRank(row: IDisc) {
  const thisRank = row.thisRank ? formatNumber(row.thisRank, '****') : '----'
  const prevRank = row.prevRank ? formatNumber(row.prevRank, '****') : '----'
  return `${thisRank}位/${prevRank}位`
}

function comparePt(apply: (disc: IDisc) => number | undefined) {
  return compareFactory<IDisc, number>({
    apply: apply,
    empty: value => value === undefined,
    compare: (a, b) => b - a
  })
}
function formatTitle(disc: IDisc) {
  return disc.titlePc || disc.title
}

function rankTdClass(disc: IDisc) {
  const HOUR = 3600 * 1000
  if (disc.updateTime) {
    const timeout = Date.now() - disc.updateTime
    if (timeout < HOUR) {
      return 'success'
    } else if (timeout > 6.1 * HOUR) {
      return 'warning'
    }
  }
  return ''
}
