// ---------- src/App.tsx ----------
import React from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Typography, Button } from 'antd'
import { AuthProvider, useAuth } from './auth'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import CompaniesPage from './pages/CompaniesPage'
import ProductsPage from './pages/ProductsPage'
import { AuthGate } from './components/AuthGate'

const { Header, Sider, Content } = Layout

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const selected = location.pathname.startsWith('/companies')
    ? ['2']
    : location.pathname.startsWith('/products')
    ? ['3']
    : ['1']

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ padding: 16, textAlign: 'center' }}>
          <span className="logo">My Admin</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selected}
          onClick={({ key }) => {
            if (key === '1') navigate('/')
            if (key === '2') navigate('/companies')
            if (key === '3') navigate('/products')
          }}
          items={[
            { key: '1', label: 'Dashboard' },
            { key: '2', label: 'Companies' },
            { key: '3', label: 'Products' },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography.Text style={{ color: '#fff' }}>Welcome {user?.username}</Typography.Text>
          <Button onClick={() => logout().then(() => navigate('/auth'))}>Logout</Button>
        </Header>
        <Content style={{ margin: 16 }}>
          <div className="content">{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}

const App: React.FC = () => (
  <AuthProvider>
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<AuthGate><Shell><Dashboard /></Shell></AuthGate>} />
      <Route path="/companies" element={<AuthGate><Shell><CompaniesPage /></Shell></AuthGate>} />
      <Route path="/products" element={<AuthGate><Shell><ProductsPage /></Shell></AuthGate>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
)

export default App
