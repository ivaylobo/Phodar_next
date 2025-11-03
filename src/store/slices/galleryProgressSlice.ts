import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GalleryProgressState = {
  winnersFinished: boolean;
  participantsFinished: boolean;
  guestsFinished: boolean;
  participantsIndex: number;
};

const initialState: GalleryProgressState = {
  winnersFinished: false,
  participantsFinished: false,
  guestsFinished: false,
  participantsIndex: 0,
};

const galleryProgressSlice = createSlice({
  name: 'galleryProgress',
  initialState,
  reducers: {
    setProgress(state, action: PayloadAction<Partial<GalleryProgressState>>) {
      console.log('setProgress', action.payload);
      Object.assign(state, action.payload);
    },
    setWinnersFinished(state, action: PayloadAction<boolean>) {
      console.log('setWinnersFinished', action.payload);
      state.winnersFinished = action.payload;
    },
    setParticipantsFinished(state, action: PayloadAction<boolean>) {
      console.log('setParticipantsFinished', action.payload);
      state.participantsFinished = action.payload;
    },
    setParticipantsIndex(state, action: PayloadAction<number>) {
      console.log('setParticipantsIndex', action.payload);
      state.participantsIndex = action.payload;
    },
  },
});

export const {
  setProgress,
  setWinnersFinished,
  setParticipantsFinished,
  setParticipantsIndex,
} = galleryProgressSlice.actions;

export default galleryProgressSlice.reducer;
