// ---------- src/types.ts ----------
export type ID = string

export type User = {
  id: ID
  username: string
  passwordHash: string
}

export type Company = {
  id: ID
  name: string
  legalNumber: string
  country: string
  website: string
  createdAt: string
}

export type Product = {
  id: ID
  name: string
  category: string
  amount: number
  unit: string
  companyId: ID
  createdAt: string
}

export type JWT = {
  token: string
  userId: ID
  username: string
}
