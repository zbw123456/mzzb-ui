import { useEffect, useState } from "react";
import request from "../functions/request";

export function useDocumentTitle(title: string, inputs: ReadonlyArray<any> = []) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title + ' - mingzuozhibi.com'
    return () => document.title = prevTitle
  }, inputs)
}

interface IState<T> {
  loading: boolean
  error?: string
  data?: T
}

export function useGetJson<T>(url: string, initialState: IState<T> = { loading: false }) {
  const [state, setState] = useState<IState<T>>(initialState)
  useEffect(() => {
    request(url)
      .then(json => setState({ loading: true, data: json.data }))
      .catch(error => setState({ ...state, error: error.message }))
  }, [])
  return state
}

export function useInput<S>(initialState: S | (() => S)) {
  const [value, setValue] = useState(initialState)
  return { value, onChange: (e: any) => setValue(e.target.value) }
}
