import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface PropertyData {
    propertyId: string;
    ListingId: string;
    UnparsedAddress: string;
    ListPrice: string; // Keep as string if it includes currency symbol
    LivingArea: string;
    BedroomsTotal: number;
    BathroomsFull: number;
    BathroomsTotalDecimal: number;
    CloseDate: string;
    OffMarketDate: string;
    MlsStatus: string;
    LotSizeSquareFeet: string;
    YearBuilt: number;
    DaysOnMarket: number;
    PropertySubType: string;
    HOAPresence_derived: string;
    location: {
        latitude: number;
        longitude: number;
    };
    image_url: string;
}

interface PropertyState {
    propertyData: PropertyData | null;
    propertyFact: string | null;
    isLoading: boolean;
    sidebarListings: any[];
    features: any[];
}

const initialState: PropertyState = {
    propertyData: null,
    propertyFact: null,
    isLoading: false,
    sidebarListings: [],
    features: []
}

const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        setPropertyData: (state, action: PayloadAction<PropertyData>) => {
            state.propertyData = action.payload;
        },
        setPropertyFact: (state, action: PayloadAction<string>) => {
            state.propertyFact = action.payload;
        },
        clearPropertyData: (state) => {
            state.propertyData = null;
            state.propertyFact = null;
        },
        setPropertyLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setSidebarListings: (state, action: PayloadAction<string[]>) => {
            state.sidebarListings = action.payload;
        },
        clearSidebarListings: (state) => {
            state.sidebarListings = [];
        },
        setPropertyFeatures: (state, action) => {
            state.features = action.payload;
        },
        clearPropertyFeatures: (state) => {
            state.features = [];
        }
    }
})

export const {
    setPropertyData,
    clearPropertyData,
    setPropertyLoading,
    setPropertyFact,
    setSidebarListings,
    clearSidebarListings,
    setPropertyFeatures,
    clearPropertyFeatures
} = propertySlice.actions;

export const selectPropertyData = (state: RootState) => state.propertySlice.propertyData;
export const selectPropertyFact = (state: RootState) => state.propertySlice.propertyFact;
export const selectPropertySidebarListings = (state: RootState) => state.propertySlice.sidebarListings;
export const selectPropertyFeatures = (state: RootState) => state.propertySlice?.features || [];

export default propertySlice.reducer;
