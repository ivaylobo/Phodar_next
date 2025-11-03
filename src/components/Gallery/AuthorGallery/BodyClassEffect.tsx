'use client';

import { useEffect } from 'react';

const CLASS_NAME = 'gallery-fullscreen';

export default function BodyClassEffect() {
  useEffect(() => {
    document.body.classList.add(CLASS_NAME);
    return () => {
      document.body.classList.remove(CLASS_NAME);
    };
  }, []);

  return null;
}

