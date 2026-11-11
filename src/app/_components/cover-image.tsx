"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
};

export function CoverImage({ src, alt, sizes }: Props) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if the image is already complete (cached / 304) when mounted
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight > 0) {
      setLoaded(true);
    }
  }, []);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <div
      className={`relative liquid-glass-media cover-skeleton aspect-video overflow-hidden rounded-[24px] sm:rounded-[48px]${loaded ? " cover-loaded" : ""}`}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105"
        style={{
          transition: "transform 0.3s ease",
        }}
        onLoad={handleLoaded}
        onError={handleLoaded}
      />
    </div>
  );
}
