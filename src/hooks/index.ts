import { useEffect, useState } from "react";
import request from "../functions/request";

/**
 * useDocumentTitle()
 */
export function useDocumentTitle(title: string, inputs: ReadonlyArray<any> = []) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${title} - mingzuozhibi.com`
    return () => document.title = prevTitle
  }, ...inputs)
}

/**
 * useInput()
 */
export function useInput<S>(initialState: S | (() => S)) {
  const [value, setValue] = useState(initialState)
  return { value, onChange: (e: any) => setValue(e.target.value) }
}

/**
 * useGetJson()
 */
interface IResult<IData> {
  loading: boolean
  error?: string
  data?: IData
}

export type Result<IData> = IResult<IData> & { refresh: () => void }

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
  return { ...state, refresh: () => setCount(count + 1) }
}
