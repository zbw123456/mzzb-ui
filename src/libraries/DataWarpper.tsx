import React from 'react';
import Spin from 'antd/lib/spin';
import Alert from 'antd/lib/alert';
import { IResult } from '../hooks';
import Button from 'antd/lib/button';

interface IProps<T> {
  result: IResult<T>
  refresh?: () => void
  render: (data: T) => JSX.Element
  renderError?: (error: string) => JSX.Element,
  renderLoading?: (first: boolean) => JSX.Element
  renderRefresh?: (refresh: () => void) => JSX.Element,
}

function defaultRenderLoading(first: boolean) {
  return (
    <Spin delay={first ? 200 : 0} />
  )
}

function defaultRenderError(error: string) {
  return (
    <Alert type="error" banner={true} message={error} />
  )
}

function defaultRenderRefresh(refresh: () => void) {
  return (
    <div style={{ padding: 5 }}>
      <span style={{ margin: 5 }}>未能获取到数据</span>
      <Button onClick={refresh}>尝试重新获取</Button>
    </div>
  )
}

export default function DataWarpper<T>({
  result: { loading, error, data },
  refresh,
  render,
  renderError = defaultRenderError,
  renderLoading = defaultRenderLoading,
  renderRefresh = defaultRenderRefresh,
}: IProps<T>) {
  return (
    <div className="DataWarpper">
      {loading && renderLoading(!error && !data)}
      {error && renderError(error)}
      {data && render(data)}
      {!data && error && refresh && renderRefresh(refresh)}
    </div>
  )
}
