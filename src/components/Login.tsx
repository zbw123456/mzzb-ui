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

function Login() {
  useDocumentTitle('Login')
  const username = useInput('admin')
  const password = useInput('123456')
  const session = useGetJson<ISession>('/api/session')
  if (!session.data) {
    return (
      <div className="Login">
        {session.error && (
          <Alert type="error" message={session.error} />
        )}
      </div>
    )
  }
  const { isLogged } = session.data
  if (isLogged) {
    return (
      <div className="Login">
        {session.data.userName} is logged.
      </div>
    )
  }
  return (
    <div className="Login">
      <div className='ant-input-form'>
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

export default Login
