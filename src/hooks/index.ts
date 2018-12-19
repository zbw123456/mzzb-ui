import { useEffect, useState } from "react";
import request from "../functions/request";

export function useDocumentTitle(title: string, inputs: ReadonlyArray<any> = []) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${title} - mingzuozhibi.com`
    return () => document.title = prevTitle
  }, inputs)
}

export interface IResult<T> {
  error?: string
  data?: T
}

export function useGetJson<T>(url: string, initialState: IResult<T> = {}) {
  const [state, setState] = useState<IResult<T>>(initialState)
  useEffect(() => {
    request(url)
      .then(json => setState({ data: json.data }))
      .catch(error => setState({ error: error.message }))
  }, [url])
  return state
}

export function useInput<S>(initialState: S | (() => S)) {
  const [value, setValue] = useState(initialState)
  return { value, onChange: (e: any) => setValue(e.target.value) }
}
