import React from 'react';
import Spin from 'antd/lib/spin';
import Alert from 'antd/lib/alert';
import { IResult } from '../hooks';

interface IProps<T> {
  data: IResult<T>
  render: (data: T) => JSX.Element
  renderError?: (error: string) => JSX.Element,
  renderLoading?: () => JSX.Element
}

export default function DataWarpper<T>({
  data,
  render,
  renderError = (error: string) => <Alert type="error" message={error} />,
  renderLoading = () => <Spin delay={200} />,
}: IProps<T>) {
  if (data.data) {
    return render(data.data)
  }
  if (data.error) {
    return renderError(data.error)
  }
  return renderLoading()
}
