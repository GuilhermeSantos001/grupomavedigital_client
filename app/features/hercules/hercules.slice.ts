/**
 * @description Reducer -> Hercules Storage
 * @author GuilhermeSantos001
 * @update 14/12/2021
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ItemFolderId = {
  id: string
  parentId: string
}

export interface HerculesState {
  itemsFolderId: ItemFolderId[]
  reloadItemsOfPage: boolean
}

const initialState: HerculesState = {
  itemsFolderId: [],
  reloadItemsOfPage: false,
};

export const reducerSlice = createSlice({
  name: 'hercules',
  initialState,
  reducers: {
    // ? Usado para mover os itens para as pastas
    appendItemFolderId: (state, action: PayloadAction<ItemFolderId>) => {
      state.itemsFolderId.push(action.payload);
    },
    // ? Usado para remover os itens das pastas
    removeItemFolderId: (state, action: PayloadAction<string>) => {
      state.itemsFolderId = state.itemsFolderId.filter(item => item.id !== action.payload);
    },
    // ? Usado para resetar os itens movidos para as pastas
    resetItemsFolderId: (state) => {
      state.itemsFolderId = [];
    },
    // ? Usado para definir o reloadItemsOfPage
    setReloadItemsOfPage: (state, action: PayloadAction<boolean>) => {
      state.reloadItemsOfPage = action.payload;
    }
  }
})

export const {
  appendItemFolderId,
  removeItemFolderId,
  resetItemsFolderId,
  setReloadItemsOfPage,
} = reducerSlice.actions

export default reducerSlice.reducer