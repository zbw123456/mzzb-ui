import React from 'react';
import Spin from 'antd/lib/spin';
import Alert from 'antd/lib/alert';
import { IResult } from '../hooks';

interface IProps<T> {
  result: IResult<T>
  render: (data: T) => JSX.Element
  renderError?: (error: string) => JSX.Element,
  renderLoading?: () => JSX.Element
}

export default function DataWarpper<T>({
  result,
  render,
  renderError = (error: string) => <Alert type="error" message={error} />,
  renderLoading = () => <Spin delay={200} />,
}: IProps<T>) {
  if (result.data && result.error) {
    return <>
      {renderError(result.error)}
      {render(result.data)}
    </>
  }
  if (result.data) {
    return render(result.data)
  }
  if (result.error) {
    return renderError(result.error)
  }
  return renderLoading()
}
