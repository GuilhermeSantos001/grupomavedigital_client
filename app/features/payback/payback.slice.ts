/**
 * @description Slice -> Payback
 * @author GuilhermeSantos001
 * @update 17/01/2022
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Status, Upload } from '@/app/features/system/system.slice'

export type PaymentStatus = 'payable' | 'paid' | 'cancelled'

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
  mirror: Pick<Upload, 'filename' | 'filetype' | 'fileId'> // ? Espelho de ponto da funcionário/beneficiário
  reasonForAbsence?: string // ? Motivo de falta do funcionário
  modalityOfCoverage?: string // ? Modalidade de cobertura do beneficiário
}

// ? Dados dos Lançamentos Financeiros
export type Posting = {
  id: string
  author: string // ? Usuário que criou o lançamento
  costCenter: string // ? Centro de Custo
  periodStart: string // ? Data de início do período
  periodEnd: string // ? Data de fim do período
  originDate: string // ? Data de origem do lançamento
  description: string // ? Descrição do lançamento
  coverage: PersonPosting // ? Pessoa que está realizando a cobertura do lançamento
  covering?: PersonPosting // ? Pessoa que está sendo substituída no lançamento
  coverageWorkplace?: string // ? Local de trabalho da pessoa que está realizando a cobertura do lançamento
  coveringWorkplace: string // ? Local de trabalho da pessoa que está sendo substituída no lançamento
  paymentMethod: string // ? Forma de pagamento do beneficiário
  paymentValue: number // ? Valor de pagamento do beneficiário
  paymentDatePayable: string // ? Data há pagar do lançamento
  paymentStatus: PaymentStatus // ? Status de pagamento do lançamento
  paymentDatePaid?: string // ? Data de quando foi pago o lançamento
  paymentDateCancelled?: string // ? Data de quando foi cancelado o pagamento do lançamento
  status: Status // ? Status do lote
  createdAt: string // ? Data de criação do lançamento
}

export type LotItemCreate = Omit<LotItem, 'status' | 'createdAt'>
export type PostingCreate = Omit<Posting, 'paymentStatus' | 'status' | 'createdAt'>

export interface PaybackState {
  lotItems: LotItem[]
  postings: Posting[]
}

const initialState: PaybackState = {
  lotItems: [],
  postings: []
};

export const slice = createSlice({
  name: 'payback',
  initialState,
  reducers: {
    CREATE_LOT: {
      reducer: (state, action: PayloadAction<LotItem>) => {
        if (!state.lotItems)
          state.lotItems = [];

        if (
          action.payload.costCenter.length > 0 &&
          action.payload.serialNumber.length > 0 &&
          action.payload.lastCardNumber.length > 0
        ) {
          if (
            state.lotItems.filter(item =>
              item.serialNumber === action.payload.serialNumber ||
              item.lastCardNumber === action.payload.lastCardNumber
            ).length <= 0
          ) {
            state.lotItems.push(action.payload)
          } else {
            throw new Error('Já existe um lote com esse número de série ou com os 4 últimos dígitos do número do cartão.');
          }
        } else {
          throw new Error('Não é possível criar o lote. Existem campos obrigatórios em branco.');
        }
      },
      prepare: (item: LotItemCreate) => {
        const status: Status = 'available';

        return {
          payload: {
            ...item,
            status,
            createdAt: new Date().toISOString()
          }
        }
      }
    },
    UPDATE_LOT: (state, action: PayloadAction<LotItem>) => {
      if (!state.lotItems)
        state.lotItems = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.costCenter.length > 0 &&
        action.payload.serialNumber.length > 0 &&
        action.payload.lastCardNumber.length > 0 &&
        action.payload.status.length > 0 &&
        action.payload.createdAt.length > 0
      ) {
        if (state.lotItems.filter(item => {
          if (item.id !== action.payload.id) {
            if (item.serialNumber === action.payload.serialNumber)
              return true;

            if (item.lastCardNumber === action.payload.lastCardNumber)
              return true;
          }

          return false;
        }).length > 0)
          throw new Error('Já existe um lote com esse número de série ou com os 4 últimos dígitos do número do cartão.');

        const index = state.lotItems.findIndex(item => `${item.id} - ${item.lastCardNumber}`=== `${action.payload.id} - ${action.payload.lastCardNumber}`);

        if (index !== -1)
          state.lotItems[index] = action.payload;
        else
          throw new Error(`Não foi possível encontrar o lote com o ID ${action.payload.id}.`);
      } else {
        throw new Error('Não é possível atualizar o lote. Existem campos obrigatórios em branco.');
      }
    },
    DELETE_LOT: (state, action: PayloadAction<string>) => {
      if (!state.lotItems)
        state.lotItems = [];

      const index = state.lotItems.findIndex(item => `${item.id} - ${item.lastCardNumber}` === action.payload);

      if (index !== -1)
        state.lotItems = state.lotItems.filter(item => `${item.id} - ${item.lastCardNumber}` !== action.payload);
      else
        throw new Error(`Não foi possível encontrar o lote com o ID ${action.payload}.`);
    },
    CLEAR_LOTS: (state) => {
      state.lotItems = [];
    },
    CREATE_POSTING: {
      reducer: (state, action: PayloadAction<Posting>) => {
        if (!state.postings)
          state.postings = [];

        if (
          state.postings.filter(item => {
            if (
              // ? Verifica se o posto já está sendo coberto no mesmo dia
              item.coveringWorkplace === action.payload.coveringWorkplace &&
              item.originDate == action.payload.originDate ||
              // ? Verifica se a pessoa que está cobrindo já possui um lançamento no mesmo dia
              item.coverage.id === action.payload.coverage.id &&
              item.originDate === action.payload.originDate
            )
              return true;

            return false;
          }).length <= 0
        )
          state.postings.push(action.payload);
        else
          throw new Error('Posto já está sendo coberto no mesmo dia (Data de Origem) e/ou pessoa que está cobrindo já possui um lançamento no mesmo dia (Data de Origem).');
      },
      prepare: (item: PostingCreate) => {
        const
          paymentStatus: PaymentStatus = 'payable',
          status: Status = 'available';

        return {
          payload: {
            ...item,
            paymentStatus,
            status,
            createdAt: new Date().toISOString()
          }
        }
      }
    },
    UPDATE_POSTING: (state, action: PayloadAction<Posting>) => {
      if (!state.postings)
        state.postings = [];

      const index = state.postings.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.postings[index] = action.payload;
      else
        throw new Error(`Não foi possível encontrar o lançamento com o ID ${action.payload.id}.`);
    },
    DELETE_POSTING: (state, action: PayloadAction<string>) => {
      if (!state.postings)
        state.postings = [];

      const index = state.postings.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.postings = state.postings.filter(item => item.id !== action.payload);
      else
        throw new Error(`Não foi possível encontrar o lançamento com o ID ${action.payload}.`);
    },
    CLEAR_POSTINGS: (state) => {
      state.postings = [];
    }
  }
})

export const PaybackActions = slice.actions;

export default slice.reducer