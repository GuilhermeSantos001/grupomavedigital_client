import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'

import storage from '@/app/storage'

// ! Slice -> System
import systemReducer from './features/system/system.slice'

// ! Slice -> Payback
import paybackReducer from '@/app/features/payback/payback.slice'

// ! Slice -> Hercules
import herculesReducer from '@/app/features/hercules/hercules.slice'
import herculesTreeNavigationReducer from '@/app/features/hercules/treeNavigation.slice'

const reducers = combineReducers({
  system: systemReducer,
  payback: paybackReducer,
  hercules: herculesReducer,
  herculesTreeNavigation: herculesTreeNavigationReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  timeout: 1000,
  storage,
  // ? Lista de reducers que não serão persistidos.
  blacklist: ['hercules'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;