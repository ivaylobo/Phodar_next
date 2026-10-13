"use client";

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_ID, useAnalyticsConsent } from '@/helpers/analyticsConsent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    phodarAnalyticsInitialized?: boolean;
  }
}

export default function Analytics() {
  const consent = useAnalyticsConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const lastPage = useRef<string | null>(null);
  const referrer = useRef<string | null>(null);

  useEffect(() => {
    if (!consent) return;
    window.dataLayer ??= [];
    // Google tag commands use an Arguments object in the data layer.
    // eslint-disable-next-line prefer-rest-params
    window.gtag ??= function () { window.dataLayer!.push(arguments); };
    if (!window.phodarAnalyticsInitialized) {
      window.gtag('consent', 'default', {
        analytics_storage: 'granted', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied',
      });
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { send_page_view: false });
      window.phodarAnalyticsInitialized = true;
    }
    const location = window.location.origin + pathname + (query ? `?${query}` : '');
    if (lastPage.current === location) return;
    window.gtag('event', 'page_view', {
      send_to: GA_ID,
      page_location: location,
      page_title: document.title,
      page_referrer: referrer.current ?? document.referrer,
    });
    lastPage.current = location;
    referrer.current = location;
  }, [consent, pathname, query]);

  if (!consent) return null;
  return <Script id="phodar-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />;
}
