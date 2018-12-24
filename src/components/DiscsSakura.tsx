import React from 'react';
import { RouteChildrenProps } from 'react-router';
import { useGetJson } from '../hooks/useGetJson';
import Discs, { IData } from './Discs';
import { useTitle } from '../hooks';

interface Params {
  search: string
}

const query = 'discColumns=id,asin,title,titlePc,thisRank,prevRank,todayPt,totalPt,guessPt,updateTime,surplusDays';

export default function DiscsSakura({ match }: RouteChildrenProps<Params, {}>) {
  const { search } = match!.params
  const url = `/api/sakuras/key/${search}/discs?${query}`
  const result = useGetJson<IData>(url)
  const title = result.data ? result.data.title : '载入中'
  useTitle(title, [title])
  return (
    <div className="DiscsSakura">
      <Discs
        mark={`sakura-${search}`}
        result={result}
      />
    </div>
  )
}
