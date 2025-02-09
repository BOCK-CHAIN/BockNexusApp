import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistReducer, persistStore } from 'redux-persist';
import reduxStorage from './storage';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    whitelist: ['cart', 'account'],
    blacklist: []
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(sagaMiddleware)
})
sagaMiddleware.run(rootSaga)
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;