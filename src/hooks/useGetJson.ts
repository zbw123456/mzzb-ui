import { useEffect, useState } from 'react';
import request from '../functions/request';
import immer, { Draft } from 'immer';

/**
 * useGetJson()
 */
export interface IResult<IData> {
  loading: boolean
  error?: string
  data?: IData
}

export interface IHandler<IData> {
  loading: boolean
  refresh: () => void
  produce: (updater: Updater<IData>) => void
}

interface Updater<IData> {
  (draft: Draft<IData>): void
}

export type IResultHandler<IData> = IResult<IData> & IHandler<IData>

export function useGetJson<IData>(url: string, data?: IData): IResultHandler<IData> {
  const initialState = { loading: false, data }
  const [state, setState] = useState<IResult<IData>>(initialState)

  useEffect(doFetch, [url])

  function doFetch() {
    setFetchStart()
    request(url)
      .then(setFetchSuccess)
      .catch(setFetchFailure)
  }

  function setFetchStart() {
    setState(immer(draft => {
      draft.loading = true
    }))
  }

  function setFetchSuccess(json: any) {
    setState(immer(draft => {
      draft.loading = false
      draft.data = json.data
      draft.error = undefined
    }))
  }

  function setFetchFailure(error: any) {
    setState(immer(draft => {
      draft.loading = false
      draft.error = error.message
    }))
  }

  function produce(updater: Updater<IData>) {
    setState(immer(draft => {
      draft.data && updater(draft.data)
    }))
  }

  return { ...state, refresh: doFetch, produce }
}
