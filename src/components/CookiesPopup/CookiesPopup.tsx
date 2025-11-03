'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import classes from './CookiesPopup.module.css';

type CookiesPopupProps = {
  lang: 'en' | 'bg';
};

type Texts = {
  button: string;
  text: (link: ReactNode) => ReactNode;
};

const TEXTS: Record<'en' | 'bg', Texts> = {
  en: {
    button: 'OK',
    text: (link) => (
        <>
          We use cookies so the site works better. Read our {link}.
        </>
    ),
  },
  bg: {
    button: 'Разбрах',
    text: (link) => (
        <>
          Използваме бисквитки, за да работи сайтът по-добре. Виж {link}.
        </>
    ),
  },
};

export default function CookiesPopup({ lang }: CookiesPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const accepted = window.localStorage.getItem('cookies-accepted') === 'true';
    requestAnimationFrame(() => setVisible(!accepted));
  }, []);

  const acceptCookies = () => {
    window.localStorage.setItem('cookies-accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  const link = (
      <Link href={`/${lang}/cookies`}>
        {lang === 'bg' ? 'Политиката за бисквитките' : 'cookies policy'}
      </Link>
  );

  return (
      <div className={classes.cookies}>
        <p>{TEXTS[lang].text(link)}</p>
        <button className={classes.acceptCookies} onClick={acceptCookies}>
          {TEXTS[lang].button}
        </button>
      </div>
  );
}
