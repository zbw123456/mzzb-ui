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
export interface IResult<IData> {
  loading: boolean
  error?: string
  data?: IData
}

export function useGetJson<IData>(
  url: string,
  initialState: IResult<IData> = { loading: false }
) {
  const [count, setCount] = useState(0)
  const [state, setState] = useState<IResult<IData>>(initialState)
  useEffect(() => {
    setState({ ...state, loading: true })
    request(url)
      .then(json => setState({ data: json.data, loading: false }))
      .catch(error => setState({ ...state, error: error.message, loading: false }))
  }, [url, count])
  const result = [state, () => setCount(count + 1)]
  return result as [IResult<IData>, () => void]
}
