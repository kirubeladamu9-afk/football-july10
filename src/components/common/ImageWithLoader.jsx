import { useState } from 'react';
import Image from 'next/image';

export default function ImageWithLoader({ src, alt, width, height, priority = false, className = '', ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className={`image-loader-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {isLoading && (
        <div className="image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoadingComplete={handleLoadingComplete}
        className={isLoading ? 'image-loading' : 'image-loaded'}
        {...props}
      />

      <style jsx>{`
        .image-skeleton {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #f0f0f0;
          animation: pulse 2s ease-in-out infinite;
          z-index: 1;
        }

        .skeleton-shimmer {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
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
