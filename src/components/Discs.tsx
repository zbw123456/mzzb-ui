import React from 'react';
import { RouteChildrenProps } from 'react-router';
import DataWarpper from '../libraries/DataWarpper';
import Table, { ICol } from '../libraries/Table';
import { compareFactory } from '../functions/compare';
import { useGetJson, IResult } from '../hooks';

interface Match {
  findby: string
  search: string
}

interface Search {
  title: string
  discs: IDisc[]
}

interface IDisc {
  id: number
  key: string
  asin: number
  thisRank?: number
  prevRank?: number
  totalPt?: number
  title: string
  surplusDays: number
}

const query = '?discColumns=id,asin,thisRank,prevRank,todayPt,title,surplusDays';

export default function Discs({ match }: RouteChildrenProps<Match, {}>) {
  if (match) {
    const { findby, search } = match.params
    if (findby === 'sakura') {
      const result = useGetJson<Search>(`/api/sakuras/key/${search}/discs` + query)
      return renderTable(result)
    }
  }
  return <>Nothing</>
}

function renderTable(result: IResult<Search>) {
  return (
    <DataWarpper
      result={result}
      render={search => (
        <Table
          title={search.title}
          rows={search.discs}
          cols={getCols()}
          sortRow={compareFactory<IDisc, number>({
            apply: disc => disc.thisRank,
            empty: rank => rank === undefined,
            compare: (a, b) => a - b
          })}
        />
      )}
    />
  );
}

function getCols(): ICol<IDisc>[] {
  return [
    { key: 'idx', title: '#', format: (_, idx) => idx + 1 },
    { key: 'rank', title: 'Rank', format: formatRank },
    { key: 'title', title: 'Title', format: (row) => row.title },
  ]
}

function formatRank(row: IDisc) {
  let mark = 'x'
  if (row.thisRank === row.prevRank) {
    mark = '-'
  } else if (row.thisRank && !row.prevRank) {
    mark = 'new'
  } else if (row.thisRank && row.prevRank) {
    mark = row.thisRank < row.prevRank ? '↑' : '↓'
  }
  return `${row.thisRank || '----'}/${row.prevRank || '----'}(${mark})`
}
