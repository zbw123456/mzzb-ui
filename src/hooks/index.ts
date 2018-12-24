import { useEffect, useState } from 'react';

/**
 * useDocumentTitle()
 */
export function useTitle(title: string, inputs: Array<any> = []) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${title} - mingzuozhibi.com`
    return () => document.title = prevTitle
  }, inputs)
}

/**
 * useInput()
 */
export function useInput<S>(initialState: S | (() => S)) {
  const [value, setValue] = useState(initialState)
  return { value, onChange: (e: any) => setValue(e.target.value) }
}
