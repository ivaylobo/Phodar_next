'use client';

import styles from './MobileNav.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOpen } from '@/store/slices/mobileNavSlice';

export default function MobileNav() {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector((state) => state.mobileNav.opened);

  const handleToggle = (open: boolean) => {
    dispatch(setOpen(open));
  };

  return (
    <div className={styles.navTrigger}>
      <button
        type="button"
        onClick={() => handleToggle(false)}
        className={`${styles.closeNav} ${isActive ? styles.active : ''}`}
        aria-label="Close navigation"
      >
        <span />
        <span />
      </button>
      <button
        type="button"
        onClick={() => handleToggle(true)}
        className={`${styles.openNav} ${!isActive ? styles.active : ''}`}
        aria-label="Open navigation"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  );
}
