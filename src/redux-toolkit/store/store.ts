import { useMemo } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { Action } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducer/reduce';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'], // add reducers you want to persist in localstorage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types, since they include non-serializable actions
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Export a hook that can be reused to resolve a separate store instance for each instance of the root component
export const useStore = () => {
  const store = useMemo(() => configureStore({ reducer: rootReducer }), []);

  return store;
};

export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;