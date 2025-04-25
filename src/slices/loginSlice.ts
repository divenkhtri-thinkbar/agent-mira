import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
    login_token: string | null;
    logged_in: number;
    is_recurring: boolean | null;
    nick_name: string | null;
    isSaved: boolean;
    firstName: string | null;
    lastName: string | null;
    isAdmin: boolean | null;
    full_access: boolean | null;
    lite_access: boolean | null;
}

interface LoginPayload {
    token: string;
    is_recurring: boolean;
    nick_name: string;
    firstName: string;
    lastName: string;
    is_admin: boolean;
    isSaved?: boolean;
    full_access: boolean;
    lite_access: boolean;
}

const initialState: LoginState = {
    login_token: null,
    logged_in: 0,
    is_recurring: null,
    nick_name: null,
    isSaved: false,
    firstName: null,
    lastName: null,
    isAdmin: null,
    full_access: null,
    lite_access: null
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<LoginPayload>) => {
            state.login_token = action.payload.token;
            state.is_recurring = action.payload.is_recurring;
            state.nick_name = action.payload.nick_name;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.isAdmin = action.payload.is_admin;
            state.isSaved = action.payload.isSaved ?? false;
            state.full_access = action.payload.full_access;
            state.lite_access = action.payload.lite_access;
            state.logged_in = 1;
        },
        logout: (state) => {
            state.login_token = null;
            state.is_recurring = null;
            state.nick_name = null;
            state.logged_in = 0;
            state.isSaved = false;
            state.firstName = null;
            state.lastName = null;
            state.isAdmin = null;
            state.full_access = null;
            state.lite_access = null;
        }
    }
})

export const { login, logout } = loginSlice.actions;

// RootState type will be inferred from the store
export const loginData = (state: { loginSlice: LoginState }) => state.loginSlice;
export const getToken = (state: { loginSlice: LoginState }) => state.loginSlice.login_token;

export default loginSlice.reducer;
