import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ProgressBucket = 'winners' | 'participants' | 'guests';

export type GalleryProgressState = {
  winnersFinished: boolean;
  participantsFinished: boolean;
  guestsFinished: boolean;
};

const initialState: GalleryProgressState = {
  winnersFinished: false,
  participantsFinished: false,
  guestsFinished: false,
};

const galleryProgressSlice = createSlice({
  name: 'galleryProgress',
  initialState,
  reducers: {
    setProgress(state, action: PayloadAction<Partial<GalleryProgressState>>) {
      Object.assign(state, action.payload);
    },
    setWinnersFinished(state, action: PayloadAction<boolean>) {
      console.log('winners finished')
      state.winnersFinished = action.payload;
    },
    setParticipantsFinished(state, action: PayloadAction<boolean>) {
      state.participantsFinished = action.payload;
    },
    setGuestsFinished(state, action: PayloadAction<boolean>) {
      state.guestsFinished = action.payload;
    },
    markOnAuthorClick(state, action: PayloadAction<ProgressBucket>) {
      const bucket = action.payload;
      if (bucket === 'winners') {
        console.log('winners');
        state.winnersFinished = false;
        state.participantsFinished = false;
        state.guestsFinished = false;
      } else if (bucket === 'participants') {
        console.log('participants');
        state.winnersFinished = true;
        state.participantsFinished = false;
        state.guestsFinished = false;
      } else {
        state.winnersFinished = true;
        state.participantsFinished = true;
        state.guestsFinished = false;
      }
    },
    resetProgress() {
      return initialState;
    },
  },
});

export const {
  setProgress,
  setWinnersFinished,
  setParticipantsFinished,
  setGuestsFinished,
  markOnAuthorClick,
  resetProgress,
} = galleryProgressSlice.actions;

export default galleryProgressSlice.reducer;

