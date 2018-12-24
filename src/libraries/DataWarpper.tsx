import React from 'react';
import Spin from 'antd/lib/spin';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import { Result } from '../hooks/useGetJson';

interface IProps<T> {
  result: Result<T>
  render: (data: T, loading: boolean) => JSX.Element
  renderError?: (error: string) => JSX.Element,
  renderLoading?: (first: boolean) => JSX.Element
  renderRefresh?: (refresh: () => void, loading: boolean) => JSX.Element,
}

function defaultRenderError(error: string) {
  return (
    <Alert type="error" banner={true} message={error} />
  )
}

function defaultRenderRefresh(refresh: () => void, loading: boolean) {
  return (
    <div style={{ padding: 5 }}>
      <span style={{ margin: 5 }}>未能获取到数据</span>
      <Button loading={loading} onClick={refresh}>尝试重新获取</Button>
    </div>
  )
}

export default function DataWarpper<T>({
  result: { loading, error, data, refresh },
  render,
  renderError = defaultRenderError,
  renderRefresh = defaultRenderRefresh,
}: IProps<T>) {
  return (
    <div className="DataWarpper">
      {error && renderError(error)}
      {data && render(data, loading)}
      {!data && error && refresh && renderRefresh(refresh, loading)}
    </div>
  )
}
