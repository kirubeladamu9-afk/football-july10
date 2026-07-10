import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LoadingSpinner() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      {isLoading && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading...</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .loading-spinner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
        }

        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f0f0f0;
          border-top: 4px solid #0066cc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 500;
          font-family: 'Inter', 'Noto Sans Ethiopic', sans-serif;
        }
      `}</style>
    </>
  );
}
