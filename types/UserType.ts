export type PrivilegesSystem =
  // Sistema
  | 'common'
  | 'administrador'
  | 'moderador'
  | 'supervisor'
  | 'diretoria'
  // Financeiro
  | 'fin_faturamento'
  | 'fin_assistente'
  | 'fin_gerente'
  // RH/DP
  | 'rh_beneficios'
  | 'rh_encarregado'
  | 'rh_juridico'
  | 'rh_recrutamento'
  | 'rh_sesmet'
  // Suprimentos
  | 'sup_compras'
  | 'sup_estoque'
  | 'sup_assistente'
  | 'sup_gerente'
  // Comercial
  | 'com_vendas'
  | 'com_adm'
  | 'com_gerente'
  | 'com_qualidade'
  // Operacional
  | 'ope_mesa'
  | 'ope_coordenador'
  | 'ope_supervisor'
  | 'ope_gerente'
  // Marketing
  | 'mkt_geral'
  // Juridico
  | 'jur_advogado'
  // Contabilidade
  | 'cont_contabil'
  ;

export type Location = {
  street: string
  number: number
  complement: string
  district: string
  state: string
  city: string
  zipcode: string
}

export type Devices = 'desktop' | 'phone' | 'tablet' | 'tv';
export type Unit = 's' | 'm' | 'h' | 'd'

export interface Device {
  allowed: Devices[];
  connected: Devices[];
}

export interface Session {
  connected: number;
  limit: number;
  alerts: string[];
  cache: Cache;
  device: Device;
}
export interface Token {
  signature: string;
  value: string;
  expiry: string;
  status: boolean;
}

export interface RefreshToken {
  signature: string;
  value: string;
  expiry: Date;
}

export interface History {
  token: string;
  device: Devices;
  tmp: string;
  internetAdress: string;
}

export type Cache = {
  tmp: number
  unit: Unit
  tokens: Token[]
  refreshToken: RefreshToken[];
  history: History[];
}

export interface Twofactor {
  secret: string;
  enabled: boolean;
}

export interface Authentication {
  twofactor: Twofactor;
  forgotPassword: string;
}

export type UserType = {
  authorization: string
  privileges: PrivilegesSystem[]
  privilege: string
  photoProfile: string
  username: string
  cnpj: string
  email: string
  name: string
  surname: string
  location: Location
  session: Session
  alerts: string[]
  cache: Cache
  signature: string
  authentication: Authentication
  status: boolean
}