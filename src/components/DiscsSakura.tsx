import React from 'react';
import { RouteChildrenProps } from 'react-router';
import { useGetJson } from '../hooks';
import Discs, { IData } from './Discs';

interface Params {
  search: string
}

const query = 'discColumns=id,asin,title,titlePc,thisRank,prevRank,todayPt,totalPt,guessPt,updateTime,surplusDays';

export default function DiscsSakura({ match }: RouteChildrenProps<Params, {}>) {
  const { search } = match!.params
  const url = `/api/sakuras/key/${search}/discs?${query}`
  const result = useGetJson<IData>(url)
  return (
    <div className="DiscsSakura">
      <Discs
        mark={`sakura-${search}`}
        result={result}
      />
    </div>
  )
}
