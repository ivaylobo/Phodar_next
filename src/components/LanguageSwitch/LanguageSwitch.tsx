import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './LanguageSwitch.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLanguage, SupportedLanguage } from '@/store/slices/languageSlice';

type LanguageSwitchProps = {
  currentLang: SupportedLanguage;
};

const LANGUAGE_OPTIONS: SupportedLanguage[] = ['en', 'bg'];

export default function LanguageSwitch({ currentLang }: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const selectedLang = useAppSelector((state) => state.language.current);

  useEffect(() => {
    dispatch(setLanguage(currentLang));
  }, [currentLang, dispatch]);

  const options = useMemo(
    () =>
      LANGUAGE_OPTIONS.map((value) => ({
        value,
        label: value.toUpperCase(),
      })),
    [],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextLang = event.target.value as SupportedLanguage;
      dispatch(setLanguage(nextLang));

      const segments = pathname.split('/').filter(Boolean);
      const [, ...rest] = segments;
      const nextPath = `/${[nextLang, ...rest].join('/')}${searchParams.toString() ? `?${searchParams}` : ''}`;

      router.push(nextPath);
    },
    [dispatch, pathname, router, searchParams],
  );

  return (
    <label className={styles.switch}>
      <select className={styles.select} value={selectedLang} onChange={handleChange} aria-label="Language switch">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
