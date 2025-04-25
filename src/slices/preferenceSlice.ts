import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CmaData {
    [key: string]: any; // Replace with specific CMA data structure if available
}

interface PreferenceState {
    questionId: string | null;
    cmaDataList: CmaData;
    offerInfo: any;
}

const initialState: PreferenceState = {
    questionId: null,
    cmaDataList: {},
    offerInfo: {}
};

const preferenceSlice = createSlice({
    name: 'preference',
    initialState,
    reducers: {
        setCmaList: (state, action: PayloadAction<CmaData>) => {
            state.cmaDataList = action.payload;
        },
        clearCmaList: (state) => {
            state.cmaDataList = {};
        },
        setOfferLists: (state, action: PayloadAction<any>) => {
            state.offerInfo = action.payload;
        },
        clearOfferInfo: (state) => {
            state.offerInfo = {};
        },
    },
});

export const {
    setCmaList,
    clearCmaList,
    setOfferLists,
    clearOfferInfo
} = preferenceSlice.actions;

export const getCmaData = (state: { preferenceSlice: PreferenceState }) => state.preferenceSlice.cmaDataList;
export const getOfferInfo = (state: { preferenceSlice: PreferenceState }) => state.preferenceSlice.offerInfo;

export default preferenceSlice.reducer;
