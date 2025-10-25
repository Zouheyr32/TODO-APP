import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomizerState {
  opened: boolean;
  fontFamily: string;
  borderRadius: number;
}

const initialState: CustomizerState = {
  opened: true,
  fontFamily: `'Inter', sans-serif`,
  borderRadius: 12,
};

const customizerSlice = createSlice({
  name: "customizer",
  initialState,
  reducers: {
    toggleLeftDrawer: (state) => {
      state.opened = !state.opened;
    },
    setLeftDrawer: (state, action: PayloadAction<boolean>) => {
      state.opened = action.payload;
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      state.fontFamily = action.payload;
    },
    setBorderRadius: (state, action: PayloadAction<number>) => {
      state.borderRadius = action.payload;
    },
  },
});

export const {
  toggleLeftDrawer,
  setLeftDrawer,
  setFontFamily,
  setBorderRadius,
} = customizerSlice.actions;
export default customizerSlice.reducer;
