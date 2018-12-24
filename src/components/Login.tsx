import React from 'react';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import { useDocumentTitle, useInput, useGetJson } from '../hooks';

interface ISession {
  isLogged: boolean
  userName: string
  onlineUserCount: number
  userRoles: string[]
}

export default function Login() {
  useDocumentTitle('Login')
  const username = useInput('admin')
  const password = useInput('123456')
  const result = useGetJson<ISession>('/api/session')
  if (result.error) {
    return (
      <Alert type="error" message={result.error} />
    )
  }
  if (result.data) {
    const { isLogged, userName } = result.data
    if (isLogged) {
      return (
        <div className="Login">
          {userName} is logged.
        </div>
      )
    }
  }
  return (
    <div className="Login">
      <div className="form-warpper">
        <Input
          {...username}
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="Enter username"
        />
        <Input
          {...password}
          type="password"
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="Enter password"
        />
        <Button type="primary">Login</Button>
      </div>
    </div>
  )
}
