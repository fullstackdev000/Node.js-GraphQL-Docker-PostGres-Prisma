import { Order, RealEstate } from '#veewme/graphql/types'

/* Types that should be used by backend */

// Add/update/list endpoints should accept/return data in such shape
export interface Domain {
  id: number
  url: string
  orderId?: OrderForDomain['id']
  // true -> domain existed before and user only added it to our app
  // false - user purchased and registerred brand new domain using our app
  existing: boolean
}

// This type should be used for list of top-level domains (e.g com, org, net) with prices
export interface TopDomain {
  name: string
  price: number
  currency: string
}

/* Frontend only types irrelevant for backend */
export type OrderForDomain = Pick<Order, 'id' | 'status'> & {
  realEstate: Pick<RealEstate, 'address'>
}
export interface DomainItemProps {
  domain: Domain
  onDelete: (id: Domain['id']) => void
  onOrderChange: (id: Domain['id'], orderId: OrderForDomain['id']) => void
  orders: OrderForDomain[]
}

export type DomainsListProps = Omit<DomainItemProps, 'domain'> & {
  domains: Domain[]
}
