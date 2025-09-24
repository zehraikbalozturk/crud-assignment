// ---------- src/pages/AuthPage.tsx ----------
import React, { useState } from 'react'
import { Card, Tabs, Form, Input, Button, Typography, message } from 'antd'
import { useAuth } from '../auth'
import { useNavigate } from 'react-router-dom'  


const AuthPage: React.FC = () => {
  const { login, register } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()  

  async function onLogin(values: any) {
    try { setLoading(true); await login(values.username, values.password); message.success('Logged in')  
    navigate('/')  }
    catch (e: any) { message.error(e.message) } finally { setLoading(false) }
  }
  async function onRegister(values: any) {
    try { setLoading(true); await register(values.username, values.password); message.success('Registered')
         navigate('/')  
    }
    catch (e: any) { message.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card title={<span className="logo">My Admin</span>} style={{ width: 360 }}>
        <Tabs
          items={[
            { key: 'login', label: 'Login', children: (
              <Form layout="vertical" onFinish={onLogin}>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>Login</Button>
              </Form>
            ) },
            { key: 'register', label: 'Register', children: (
              <Form layout="vertical" onFinish={onRegister}>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, min: 4 }]}>
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>Create Account</Button>
              </Form>
            ) },
          ]}
        />
        <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
          Demo user: <b>admin / admin</b>
        </Typography.Paragraph>
      </Card>
    </div>
  )
}
export default AuthPage
