import { useState } from 'react';
import Image from 'next/image';

export default function ImageWithLoader({ src, alt, width, height, priority = false, className = '', fill = false, ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className={`image-loader-wrapper ${className}`}>
      {isLoading && <div className="image-skeleton"></div>}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        onLoadingComplete={handleLoadingComplete}
        className={isLoading ? 'image-loading' : 'image-loaded'}
        {...props}
      />

      <style jsx>{`
        .image-loader-wrapper {
          position: relative;
          overflow: hidden;
        }

        .image-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #f0f0f0 0%,
            #e8e8e8 50%,
            #f0f0f0 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          z-index: 1;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        :global(.image-loading) {
          opacity: 0;
        }

        :global(.image-loaded) {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
