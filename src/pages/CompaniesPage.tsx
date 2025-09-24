import React, { useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal, Space, Table, Form, Select, message, Popconfirm } from 'antd'
import { mockApi } from '../api/mock'
import type { Company } from '../types'


const countryOptions = ['USA','Germany','UK','Türkiye','France','Italy','Japan','Canada','Netherlands'].map(x=>({label:x,value:x}))

const CompaniesPage: React.FC = () => {
  const [data, setData] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Company | null>(null)
  const [form] = Form.useForm()
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const list = await mockApi.listCompanies()
    setData(list)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => data.filter(c => {
    const s = search.toLowerCase()
    return [c.name, c.legalNumber, c.country, c.website].some(v => v.toLowerCase().includes(s))
  }), [data, search])

  function newItem() { setEditing(null); form.resetFields(); setOpen(true) }
  function editItem(rec: Company) { setEditing(rec); form.setFieldsValue(rec); setOpen(true) }

  async function onFinish(values: any) {
    try {
      if (editing) {
        await mockApi.updateCompany(editing.id, values)
        message.success('Company updated')
      } else {
        await mockApi.createCompany(values)
        message.success('Company created')
      }
      setOpen(false); load()
    } catch (e: any) { message.error(e.message) }
  }

  async function confirmDelete(rec: Company) {
  
  const products = await mockApi.listProducts()
  const relatedCount = products.filter(p => p.companyId === rec.id).length

  await mockApi.deleteCompany(rec.id) 
  message.success(
    relatedCount > 0
      ? `Deleted ${rec.name} and ${relatedCount} related product(s).`
      : `Deleted ${rec.name}.`
  )
  await load() 
}



  return (
    <>
      <Space style={{ justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
        <Input.Search placeholder="Search companies" onSearch={setSearch} allowClear style={{ maxWidth: 320 }} />
        <Button type="primary" onClick={newItem}>Add Company</Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={filtered}
        pagination={{ pageSize: 5 }}
        columns={[
          { title: 'Company Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
          { title: 'Legal Number', dataIndex: 'legalNumber', sorter: (a, b) => a.legalNumber.localeCompare(b.legalNumber) },
          {
            title: 'Country',
            dataIndex: 'country',
            filters: countryOptions.map(o => ({ text: o.label, value: o.value })),
            onFilter: (v, rec) => rec.country === v
          },
          {
            title: 'Website',
            dataIndex: 'website',
            render: (v: string) => <a href={v} target="_blank" rel="noopener noreferrer">{v}</a>
          },
          {
            title: 'Actions',
            render: (_: any, rec: Company) => (
              <Space>
                <Button onClick={() => editItem(rec)}>Edit</Button>
                <Popconfirm
                  title={`Delete ${rec.name}?`}
                  okText="Delete"
                  okType="danger"
                  cancelText="Cancel"
                  onConfirm={() => confirmDelete(rec)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />
      <Modal
        open={open}
        title={editing ? 'Edit Company' : 'Add Company'}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ country: 'Türkiye' }}
        >
          <Form.Item name="name" label="Company Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="legalNumber" label="Company Legal Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Incorporation Country" rules={[{ required: true }]}>
            <Select options={countryOptions} showSearch />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true, type: 'url', message: 'Enter a valid URL' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default CompaniesPage
