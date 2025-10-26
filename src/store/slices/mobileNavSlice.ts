import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MobileNavState = {
  opened: boolean;
};

const initialState: MobileNavState = {
  opened: false,
};

const mobileNavSlice = createSlice({
  name: 'mobileNav',
  initialState,
  reducers: {
    setOpen(state, action: PayloadAction<boolean>) {
      state.opened = action.payload;
    },
  },
});

export const { setOpen } = mobileNavSlice.actions;

export default mobileNavSlice.reducer;
