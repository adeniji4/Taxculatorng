import { useEffect } from "react";

interface InArticleAdProps {
  slot: string;
  className?: string;
}

export function InArticleAd({ slot, className = "" }: InArticleAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense not loaded yet");
    }
  }, [slot]);

  return (
    <div className={`in-article-ad ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", margin: "0 auto" }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // Replace with your AdSense ID
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
