/**
 * @description Reducer -> Payback
 * @author GuilhermeSantos001
 * @update 08/01/2022
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Status, Workplace } from '@/app/features/system/system.slice'

declare type PaymentStatus = 'payable' | 'paid' | 'cancelled'

// ? Dados do lote de Cartões Beneficio
export type LotItem = {
  id: string
  costCenter: string // ? Centro de Custo
  serialNumber: string // ? Número de série do cartão
  lastCardNumber: string // ? 4 últimos números do cartão
  status: Status // ? Status do lote
  createdAt: string // ? Data de criação do lote
  person?: string // ? Pessoa que recebeu o cartão
}

// ? Dados da pessoa do lançamento
export type PersonPosting = {
  id: string // ? ID da pessoa
  mirror: string // ? Espelho de ponto da funcionário/beneficiário
  reasonForAbsence?: string // ? Motivo de falta do funcionário
  reasonForCoverage?: string // ? Motivo de cobertura do beneficiário
}

// ? Dados dos Lançamentos Financeiros
export type Posting = {
  id: string
  costCenter: string // ? Centro de Custo
  periodStart: string // ? Data de início do período
  periodEnd: string // ? Data de fim do período
  owner: string // ? Usuário que criou o lançamento
  responsible: string // ? Usuário responsável pelo lançamento
  originDate: string // ? Data de origem do lançamento
  description: string // ? Descrição do lançamento
  coverage: PersonPosting // ? Pessoa que está realizando a cobertura do lançamento
  covering: PersonPosting // ? Pessoa que está sendo substituída no lançamento
  coverageWorkplace: Workplace // ? Local de trabalho da pessoa que está realizando a cobertura do lançamento
  coveringWorkplace: Workplace // ? Local de trabalho da pessoa que está sendo substituída no lançamento
  paymentMethod: string // ? Forma de pagamento do lançamento
  paymentValue: number // ? Valor de pagamento do lançamento
  paymentDatePayable: string // ? Data há pagar do lançamento
  paymentStatus: PaymentStatus // ? Status de pagamento do lançamento
  paymentDatePaid?: string // ? Data de quando foi pago o lançamento
  paymentDateCancelled?: string // ? Data de quando foi cancelado o pagamento do lançamento
  status: Status // ? Status do lote
  createdAt: string // ? Data de criação do lançamento
}

export interface PaybackState {
  lotItems: LotItem[]
  postings: Posting[]
}

const initialState: PaybackState = {
  lotItems: [],
  postings: []
};

export const reducerSlice = createSlice({
  name: 'payback',
  initialState,
  reducers: {
    // ? Usado para adicionar um novo item ao lote
    appendItemLot: (state, action: PayloadAction<LotItem>) => {
      if (!state.lotItems)
        state.lotItems = [];

      if (state.lotItems.filter(item => item.serialNumber === action.payload.serialNumber || item.lastCardNumber === action.payload.lastCardNumber).length <= 0)
        state.lotItems.push(action.payload);
    },
    // ? Usado para editar um item do lote
    editItemLot: (state, action: PayloadAction<LotItem>) => {
      if (!state.lotItems)
        state.lotItems = [];

      const index = state.lotItems.findIndex(item => item.id === action.payload.id && item.lastCardNumber === action.payload.lastCardNumber);

      if (index !== -1)
        state.lotItems[index] = action.payload;
    },
    // ? Usado para remover um item do lote
    removeItemLot: (state, action: PayloadAction<string>) => {
      if (!state.lotItems)
        state.lotItems = [];

      state.lotItems = state.lotItems.filter(item => item.serialNumber !== action.payload);
    },
    // ? Usado para limpar o lote
    clearLot: (state) => {
      state.lotItems = [];
    },
    // ? Usado para adicionar um novo lançamento
    appendPosting: (state, action: PayloadAction<Posting>) => {
      if (!state.postings)
        state.postings = [];

      if (
        state.postings.filter(item => {
          // ? Verifica se a pessoa que está cobrindo já possui um lançamento no mesmo dia
          if (
            item.coverage.id === action.payload.coverage.id &&
            item.originDate === action.payload.originDate
          )
            return false;

          return true
        }).length <= 0
      )
        state.postings.push(action.payload);
    },
    // ? Usado para editar um lançamento
    editPosting: (state, action: PayloadAction<Posting>) => {
      if (!state.postings)
        state.postings = [];

      const index = state.postings.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.postings[index] = action.payload;
    },
    // ? Usado para remover um lançamento
    removePosting: (state, action: PayloadAction<string>) => {
      if (!state.postings)
        state.postings = [];

      state.postings = state.postings.filter(item => item.id !== action.payload);
    },
    // ? Usado para limpar os lançamentos
    clearPostings: (state) => {
      state.postings = [];
    }
  }
})

export const {
  appendItemLot,
  editItemLot,
  removeItemLot,
  clearLot,
  appendPosting,
  editPosting,
  removePosting,
  clearPostings,
} = reducerSlice.actions

export default reducerSlice.reducer