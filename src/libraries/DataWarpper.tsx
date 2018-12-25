import React from 'react';
import Spin from 'antd/lib/spin';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import { IResultHandler } from '../hooks/useGetJson';

interface IProps<IData> {
  result: IResultHandler<IData>
  render: (data: IData) => JSX.Element
  renderError?: (error: string) => JSX.Element,
  renderRefresh?: (refresh: () => void, loading: boolean) => JSX.Element,
  renderFirstLoading?: () => JSX.Element
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

function defaultRenderFirstLoading() {
  return (
    <Spin delay={200} />
  )
}

export default function DataWarpper<T>({
  result,
  render,
  renderError = defaultRenderError,
  renderRefresh = defaultRenderRefresh,
  renderFirstLoading = defaultRenderFirstLoading,
}: IProps<T>) {
  const { loading, error, data, refresh } = result
  const firstLoading = loading && !error && !data
  const neverSuccess = error && !data
  return (
    <div className="DataWarpper">
      {firstLoading && renderFirstLoading()}
      {error && renderError(error)}
      {neverSuccess && renderRefresh(refresh, loading)}
      {data && render(data)}
    </div>
  )
}
