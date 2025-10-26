'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MainNavigation.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { SupportedLanguage } from '@/store/slices/languageSlice';
import { setOpen } from '@/store/slices/mobileNavSlice';
import type { MenuItem } from '@/graphql/queries/getMenu';

type MainNavigationProps = {
  currentLang: SupportedLanguage;
  menu: MenuItem[];
};

export default function MainNavigation({ currentLang, menu }: MainNavigationProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector((state) => state.mobileNav.opened);

  const handleLinkClick = () => {
    if (mobileOpen) dispatch(setOpen(false));
  };

  const navClassName = `${styles.mainLinks} ${mobileOpen ? styles.active : ''}`;

  const normalizeUrl = (url: string) => {
    const clean = url.replace('http://phodar.local', '');
    return clean.replace(/\/home\/?$/, '/');
  };

  return (
      <ul className={navClassName}>
        {menu.map((item) => {
          const href = normalizeUrl(item.url);

          // 🧩 Нормализираме и текущия път
          const normalizedPath =
              pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
          const normalizedHref =
              href.endsWith('/') && href !== '/' ? href.slice(0, -1) : href;
          const isActive = normalizedPath === normalizedHref;

          return (
              <li key={item.id}>
                <Link
                    href={href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={handleLinkClick}
                >
                  {item.label.replace(/\s*(en|bg)\s*$/i, '').trim()}
                </Link>
              </li>
          );
        })}
      </ul>
  );
}
