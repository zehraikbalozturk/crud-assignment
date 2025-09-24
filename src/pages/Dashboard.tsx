// ---------- src/pages/Dashboard.tsx ----------
import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, Row, Statistic, List, Typography } from 'antd'
import { mockApi } from '../api/mock'
import type { Company, Product } from '../types'


const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [products, setProducts] = useState<Product[]>([])

  async function load() {
    const [c, p] = await Promise.all([mockApi.listCompanies(), mockApi.listProducts()])
    setCompanies(c); setProducts(p)
  }
  useEffect(() => { load() }, [])

  const latestCompanies = useMemo(() => [...companies].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,3), [companies])
  const latestProducts = useMemo(() => [...products].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,3), [products])

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12} lg={6}>
        <Card><Statistic title="Companies" value={companies.length} /></Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card><Statistic title="Products" value={products.length} /></Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Latest Companies">
          <List
            dataSource={latestCompanies}
            renderItem={(c) => (
              <List.Item>
                <List.Item.Meta title={c.name} description={`${c.country} • ${c.website}`} />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Latest Products">
          <List
            dataSource={latestProducts}
            renderItem={(p) => (
              <List.Item>
                <List.Item.Meta title={p.name} description={`${p.category} • ${p.amount} ${p.unit}`} />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Card>
          <Typography.Paragraph>
            Add, edit, or delete companies/products to see numbers and lists update automatically.
          </Typography.Paragraph>
        </Card>
      </Col>
    </Row>
  )
}
export default Dashboard
