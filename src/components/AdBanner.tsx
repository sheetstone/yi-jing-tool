import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot: string;        // your ad unit slot ID from AdSense
  adFormat?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({ adSlot, adFormat = 'auto', style }: AdBannerProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded (dev/localhost)
    }
  }, []);

  return (
    <div className="ad-banner-wrapper" style={{ width: '100%', textAlign: 'center', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9733351111630000"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
