# Google Analytics 4

Measurement ID: `G-0R3EVNK6EG`. Override with `NEXT_PUBLIC_GA_MEASUREMENT_ID` before building if needed.

The root layout loads Google Analytics only when the existing popup's `cookies-accepted` localStorage flag equals `true`. The popup and its styling are unchanged. Existing accepted choices are respected. A storage subscription with a 500ms check detects acceptance in the same tab without modifying the popup.

The client component queues one manual `page_view` for the current URL and each pathname/query change, including language switches and back/forward navigation. Automatic initial pageviews are disabled with `send_page_view: false`.

## Required GA4 setting

Admin → Data streams → select the web stream → Enhanced measurement settings → Page views → Advanced settings → turn OFF “Page changes based on browser history events”. Manual pageviews otherwise overlap with Enhanced Measurement. Keep other desired measurements enabled.

## Verify after deployment

1. With cookies not accepted: no request to `googletagmanager.com/gtag/js` or Analytics collection endpoints should be sent.
2. Click the existing popup’s “Разбрах” / “OK”: check one `page_view` for the current URL in Tag Assistant/DebugView or collection requests.
3. Navigate to multiple pages, switch language, and use back/forward: check one pageview per navigation.
4. Reload after acceptance: Analytics should load and record the current page once.
5. View per-page counts in Reports → Engagement → Pages and screens, using Page path and screen class. Realtime can confirm incoming visits; standard reports may take 24–48 hours.

Update the published cookie/privacy policy to describe Google Analytics before release. Counts cover consenting visitors whose browsers allow Analytics. Live delivery requires deployment and access to the GA4 property; local type/lint checks cannot verify it.
