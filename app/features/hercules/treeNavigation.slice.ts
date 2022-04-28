/**
 * @description Reducer -> Hercules Storage -> Árvore de Navegação
 * @author GuilhermeSantos001
 * @update 14/12/2021
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ItemHistoryNavigation = {
  id: string
  name: string
  root: boolean
  folderId: string | null
  foldersId: string[] | null
}

export interface HerculesState {
  itemsHistoryNavigation: ItemHistoryNavigation[]
}

const initialState: HerculesState = {
  itemsHistoryNavigation: [],
};

export const reducerSlice = createSlice({
  name: 'hercules-treeNavigation',
  initialState,
  reducers: {
    // ? Usado para adicionar os itens a árvore de navegação
    appendItemHistoryNavigation: (state, action: PayloadAction<ItemHistoryNavigation>) => {
      if (state.itemsHistoryNavigation.filter(item => item.id === action.payload.id).length === 0)
        state.itemsHistoryNavigation.push(action.payload);
    },
    // ? Usado para definir o root na árvore de navegação
    setItemHistoryNavigation: (state, action: PayloadAction<string>) => {
      const
        source = state.itemsHistoryNavigation.filter(item => item.id === '_root')[0],
        rootIndex = state.itemsHistoryNavigation.findIndex(item => item.root === true),
        indexOf = state.itemsHistoryNavigation.findIndex(item => item.id === action.payload);

      if (indexOf !== -1) {
        if (source.id === state.itemsHistoryNavigation[indexOf].id) {
          source.root = true;
          state.itemsHistoryNavigation = [source];
        }
        else {
          state.itemsHistoryNavigation[rootIndex].root = false;
          state.itemsHistoryNavigation[indexOf].root = true;

          state.itemsHistoryNavigation = state.itemsHistoryNavigation.filter(folder => {
            if (
              folder.root === true ||
              folder.foldersId instanceof Array &&
              folder.foldersId.includes(state.itemsHistoryNavigation[indexOf].folderId)
            )
              return true;

            return false;
          });

          state.itemsHistoryNavigation = [source].concat(state.itemsHistoryNavigation);
        }
      }
    },
    setFoldersIdItemHistoryNavigation: (state, action: PayloadAction<{
      id: string,
      foldersId: string[] | null
    }>) => {
      const indexOf = state.itemsHistoryNavigation.findIndex(item => item.id === action.payload.id);

      if (indexOf !== -1)
        state.itemsHistoryNavigation[indexOf].foldersId = action.payload.foldersId;
    },
    // ? Usado para resetar a árvore de navegação
    resetItemHistoryNavigation: (state) => {
      state.itemsHistoryNavigation = [];
    }
  }
})

export const {
  appendItemHistoryNavigation,
  setItemHistoryNavigation,
  setFoldersIdItemHistoryNavigation,
  resetItemHistoryNavigation,
} = reducerSlice.actions

export default reducerSlice.reducer