import type { Company, Product, User, JWT } from '../types'

import { uid, nowISO } from '../utils'



const LS_KEYS = {
  users: 'app_users',
  companies: 'app_companies',
  products: 'app_products',
  auth: 'app_auth',
}

function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T) : fallback
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

;(function seed() {
  const users = read<User[]>(LS_KEYS.users, [])
  if (users.length === 0) {
    const demo: User = { id: uid(), username: 'admin', passwordHash: 'admin' }
    write(LS_KEYS.users, [demo])
  }
  const companies = read<Company[]>(LS_KEYS.companies, [])
  if (companies.length === 0) {
    const c1: Company = { id: uid(), name: 'Acme Corp', legalNumber: 'ACM-001', country: 'USA', website: 'https://acme.example', createdAt: nowISO() }
    const c2: Company = { id: uid(), name: 'Globex', legalNumber: 'GLX-777', country: 'Germany', website: 'https://globex.example', createdAt: nowISO() }
    write(LS_KEYS.companies, [c1, c2])
  }
  const products = read<Product[]>(LS_KEYS.products, [])
  if (products.length === 0) {
    const companies = read<Company[]>(LS_KEYS.companies, [])
    const p1: Product = { id: uid(), name: 'Widget', category: 'Gadget', amount: 120, unit: 'pcs', companyId: companies[0].id, createdAt: nowISO() }
    const p2: Product = { id: uid(), name: 'Super Glue', category: 'Adhesive', amount: 50, unit: 'ml', companyId: companies[1].id, createdAt: nowISO() }
    write(LS_KEYS.products, [p1, p2])
  }
})()

export const mockApi = {
  // auth
  register: async (username: string, password: string): Promise<JWT> => {
    const users = read<User[]>(LS_KEYS.users, [])
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists')
    }
    const user: User = { id: uid(), username, passwordHash: password }
    users.push(user)
    write(LS_KEYS.users, users)
    const jwt: JWT = { token: uid(), userId: user.id, username }
    write(LS_KEYS.auth, jwt)
    return jwt
  },
  login: async (username: string, password: string): Promise<JWT> => {
    const users = read<User[]>(LS_KEYS.users, [])
    const user = users.find(u => u.username === username && u.passwordHash === password)
    if (!user) throw new Error('Invalid credentials')
    const jwt: JWT = { token: uid(), userId: user.id, username }
    write(LS_KEYS.auth, jwt)
    return jwt
  },
  logout: async () => { localStorage.removeItem(LS_KEYS.auth) },
  currentUser: (): JWT | null => read<JWT | null>(LS_KEYS.auth, null),

  // companies
  listCompanies: async (): Promise<Company[]> => read<Company[]>(LS_KEYS.companies, []),
  createCompany: async (payload: Omit<Company, 'id' | 'createdAt'>): Promise<Company> => {
    const list = read<Company[]>(LS_KEYS.companies, [])
    const created: Company = { id: uid(), createdAt: nowISO(), ...payload }
    list.unshift(created)
    write(LS_KEYS.companies, list)
    return created
  },
  updateCompany: async (id: string, patch: Partial<Company>): Promise<Company> => {
    const list = read<Company[]>(LS_KEYS.companies, [])
    const idx = list.findIndex(c => c.id === id)
    if (idx === -1) throw new Error('Company not found')
    list[idx] = { ...list[idx], ...patch }
    write(LS_KEYS.companies, list)
    return list[idx]
  },
  deleteCompany: async (id: string): Promise<void> => {
  // Şirketi sil
  const list = read<Company[]>(LS_KEYS.companies, [])
  write(LS_KEYS.companies, list.filter(c => c.id !== id))

  // Bu şirkete bağlı ürünleri sil
  const prods = read<Product[]>(LS_KEYS.products, [])
  write(LS_KEYS.products, prods.filter(p => p.companyId !== id))
},

  // products
  listProducts: async (): Promise<Product[]> => read<Product[]>(LS_KEYS.products, []),
  createProduct: async (payload: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const list = read<Product[]>(LS_KEYS.products, [])
    const created: Product = { id: uid(), createdAt: nowISO(), ...payload }
    list.unshift(created)
    write(LS_KEYS.products, list)
    return created
  },
  updateProduct: async (id: string, patch: Partial<Product>): Promise<Product> => {
    const list = read<Product[]>(LS_KEYS.products, [])
    const idx = list.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Product not found')
    list[idx] = { ...list[idx], ...patch }
    write(LS_KEYS.products, list)
    return list[idx]
  },
  deleteProduct: async (id: string): Promise<void> => {
    const list = read<Product[]>(LS_KEYS.products, [])
    write(LS_KEYS.products, list.filter(p => p.id !== id))
  },
}
