'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainNavigation from '@/components/MainNavigation/MainNavigation';
import LanguageSwitch from '@/components/LanguageSwitch/LanguageSwitch';
import MobileNav from '@/components/MobileNav/MobileNav';
import styles from './Header.module.css';
import type { SupportedLanguage } from '@/store/slices/languageSlice';
import type {MenuItem} from "@/graphql/queries/getMenu";

type HeaderProps = {
  currentLang: SupportedLanguage;
  menu: MenuItem[]
};

const LOGO = {
  src: '/assets/images/logo.svg',
  alt: 'Phodar biennial',
};

export default function Header({ currentLang, menu }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset !== 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const homeHref = `/${currentLang}`;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerRow}>
        <Link href={homeHref} className={styles.logo}>
          <Image src={LOGO.src} alt={LOGO.alt} width={40} height={40} priority />
          <span>Phodar biennial</span>
        </Link>
        <MobileNav />
        <MainNavigation currentLang={currentLang} menu={menu}/>
        <LanguageSwitch currentLang={currentLang} />
      </div>
    </header>
  );
}
