import React from 'react';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import { useDocumentTitle, useInput } from '../hooks';

function Login() {
  useDocumentTitle('Login')
  const username = useInput('admin')
  const password = useInput('123456')
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
      </div>
    </div>
  )
}

export default Login
