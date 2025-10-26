'use client';

import { PropsWithChildren, useRef } from 'react';
import { Provider } from 'react-redux';
import { store as appStore } from '@/store';

export default function ReduxProvider({ children }: PropsWithChildren) {
  const storeRef = useRef(appStore);
  return <Provider store={storeRef.current}>{children}</Provider>;
}
