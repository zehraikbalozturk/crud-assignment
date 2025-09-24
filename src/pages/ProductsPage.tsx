// ---------- src/pages/ProductsPage.tsx ----------
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal, Space, Table, Form, Select, InputNumber, message } from 'antd'
import { mockApi } from '../api/mock'
import type { Company, Product } from '../types'


const unitOptions = ['pcs','ml','kg','m'].map(x=>({label:x,value:x}))

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form] = Form.useForm()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()

  async function load() {
    setLoading(true)
    const [p, c] = await Promise.all([mockApi.listProducts(), mockApi.listCompanies()])
    setProducts(p); setCompanies(c)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => products.filter(p => {
    const s = search.toLowerCase()
    const textMatch = [p.name, p.category].some(v => v.toLowerCase().includes(s))
    const catMatch = categoryFilter ? p.category === categoryFilter : true
    return textMatch && catMatch
  }), [products, search, categoryFilter])

  function newItem() { setEditing(null); form.resetFields(); setOpen(true) }
  function editItem(rec: Product) { setEditing(rec); form.setFieldsValue(rec); setOpen(true) }

  async function onFinish(values: any) {
    try {
      if (editing) { await mockApi.updateProduct(editing.id, values); message.success('Product updated') }
      else { await mockApi.createProduct(values); message.success('Product created') }
      setOpen(false); load()
    } catch (e: any) { message.error(e.message) }
  }

  async function remove(rec: Product) {
    Modal.confirm({ title: `Delete ${rec.name}?`, onOk: async () => { await mockApi.deleteProduct(rec.id); message.success('Deleted'); load() } })
  }

  const companyMap = useMemo(() => Object.fromEntries(companies.map(c=>[c.id, c.name])), [companies])
  const categories = Array.from(new Set(products.map(p=>p.category))).map(x=>({label:x, value:x}))

  return (
    <>
      <Space style={{ justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
        <Space>
          <Input.Search placeholder="Search products" onSearch={setSearch} allowClear style={{ maxWidth: 280 }} />
          <Select allowClear placeholder="Filter by category" style={{ width: 200 }} options={categories} onChange={setCategoryFilter} />
        </Space>
        <Button type="primary" onClick={newItem}>Add Product</Button>
      </Space>

      <Table rowKey="id" loading={loading} dataSource={filtered} pagination={{ pageSize: 5 }}
        columns={[
          { title: 'Product Name', dataIndex: 'name', sorter: (a,b)=>a.name.localeCompare(b.name) },
          { title: 'Category', dataIndex: 'category', filters: categories.map(c=>({text:c.label, value:c.value})), onFilter: (v, rec)=>rec.category===v },
          { title: 'Amount', dataIndex: 'amount', sorter: (a,b)=>a.amount - b.amount },
          { title: 'Unit', dataIndex: 'unit' },
          { title: 'Company', dataIndex: 'companyId', render: (v:string)=> companyMap[v] || '—' },
          { title: 'Actions', render: (_:any, rec: Product) => (
            <Space>
              <Button onClick={()=>editItem(rec)}>Edit</Button>
              <Button danger onClick={()=>remove(rec)}>Delete</Button>
            </Space>
          ) },
        ]}
      />

      <Modal open={open} title={editing ? 'Edit Product' : 'Add Product'} onCancel={()=>setOpen(false)} onOk={()=>form.submit()} destroyOnClose>
        <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Product Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Product Amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="unit" label="Amount Unit" rules={[{ required: true }]}>
            <Select options={unitOptions} />
          </Form.Item>
          <Form.Item name="companyId" label="Company" rules={[{ required: true }]}>
            <Select showSearch options={companies.map(c=>({label:c.name, value:c.id}))} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default ProductsPage
