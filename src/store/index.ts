import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import mobileNavReducer from './slices/mobileNavSlice';
import galleryProgressReducer from './slices/galleryProgressSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    mobileNav: mobileNavReducer,
    galleryProgress: galleryProgressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
