// Combined reducer store
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist'
import storage from 'redux-persist/lib/storage';

import loginSliceReducer from './slices/loginSlice';
import propertySliceReducer from './slices/propertySlice'
import preferenceSliceReducer from './slices/preferenceSlice'
import qnaReducer from './slices/qnaSlice';
import chatSlice from './slices/chatSlice';

const reducer = combineReducers({
    loginSlice: loginSliceReducer,
    propertySlice: propertySliceReducer,
    preferenceSlice: preferenceSliceReducer,
    qnaSlice: qnaReducer,
    chat: chatSlice,
})

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [
                FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
            ]
        }
    })
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
