import { useEffect, useState } from 'react';
import request from '../functions/request';
import immer, { Draft } from 'immer';

/**
 * useGetJson()
 */
interface IResult<IData> {
  loading: boolean
  error?: string
  data?: IData
}

export type Result<IData> = IResult<IData> & {
  refresh: () => void
  produce: (updater: Updater<IData>) => void
}

interface Updater<IData> {
  (draft: Draft<IData>): void
}

export function useGetJson<IData>(
  url: string,
  initialState: IResult<IData> = { loading: false }
): Result<IData> {
  const [count, setCount] = useState(0)
  const [state, setState] = useState<IResult<IData>>(initialState)
  useEffect(() => {
    setState({ ...state, loading: true })
    request(url)
      .then(json => setState({ data: json.data, loading: false }))
      .catch(error => setState({ ...state, error: error.message, loading: false }))
  }, [url, count])
  return {
    ...state,
    refresh: () => setCount(count + 1),
    produce: updater => {
      setState(immer(draft => {
        draft.data && updater(draft.data)
      }))
    }
  }
}
