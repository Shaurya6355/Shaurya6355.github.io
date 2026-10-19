import Script from "next/script";

/**
 * Optional, privacy-friendly page-view counting with GoatCounter (no cookies,
 * no personal data, free for personal sites). Disabled unless
 * NEXT_PUBLIC_GOATCOUNTER_URL is set at build time, e.g.
 * NEXT_PUBLIC_GOATCOUNTER_URL=https://<your-code>.goatcounter.com/count
 *
 * Nothing on the site displays visitor statistics; view them in GoatCounter's
 * own dashboard.
 */
export function Analytics() {
  const endpoint = process.env.NEXT_PUBLIC_GOATCOUNTER_URL;
  if (!endpoint || !/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(endpoint)) return null;
  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter={endpoint}
      strategy="afterInteractive"
    />
  );
}
