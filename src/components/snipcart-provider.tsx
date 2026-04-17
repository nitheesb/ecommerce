import Script from "next/script";

export function SnipcartProvider() {
  const apiKey = process.env.NEXT_PUBLIC_SNIPCART_API_KEY;

  if (!apiKey) return null;

  return (
    <>
      <Script
        src="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js"
        strategy="afterInteractive"
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.css"
      />
      <div hidden id="snipcart" data-api-key={apiKey} data-config-modal-style="side" />
    </>
  );
}
