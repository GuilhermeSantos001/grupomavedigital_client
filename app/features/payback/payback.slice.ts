/**
 * @description Reducer -> Payback
 * @author GuilhermeSantos001
 * @update 25/12/2021
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

declare type Status = 'available' | 'unavailable' | 'blocked'

export type LotItem = {
  id: string
  costCenter: string
  serialNumber: string
  lastCardNumber: string
  userAssigned?: string
  status: Status
  createdAt: string
  updatedAt: string
}

export type CostCenter = {
  id: string
  title: string
  status: Status
  createdAt: string
  updatedAt: string
}

export interface PaybackState {
  lotItems: LotItem[]
  costCenters: CostCenter[]
}

const initialState: PaybackState = {
  lotItems: [],
  costCenters: [],
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

      const index = state.lotItems.findIndex(item => item.serialNumber === action.payload.id);

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
    // ? Usado para adicionar um novo centro de custo
    appendCostCenter: (state, action: PayloadAction<CostCenter>) => {
      if (!state.costCenters)
        state.costCenters = [];

      if (state.costCenters.filter(item => item.title === action.payload.title).length <= 0)
        state.costCenters.push(action.payload);
    },
    // ? Usado para editar um centro de custo
    editCostCenter: (state, action: PayloadAction<CostCenter>) => {
      if (!state.costCenters)
        state.costCenters = [];

      const index = state.costCenters.findIndex(item => item.id === action.payload.id);

      if (index !== -1 && state.costCenters.filter(item => item.title === action.payload.title).length <= 0)
        state.costCenters[index] = action.payload;
    },
    // ? Usado para remover um centro de custo
    removeCostCenter: (state, action: PayloadAction<string>) => {
      if (!state.costCenters)
        state.costCenters = [];

      state.costCenters = state.costCenters.filter(item => item.id !== action.payload);
    },
    // ? Usado para limpar os centros de custo
    clearCostCenters: (state) => {
      state.costCenters = [];
    }
  }
})

export const {
  appendItemLot,
  editItemLot,
  removeItemLot,
  clearLot,
  appendCostCenter,
  editCostCenter,
  removeCostCenter,
  clearCostCenters
} = reducerSlice.actions

export default reducerSlice.reducer