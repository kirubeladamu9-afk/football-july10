import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PageLoader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div className="page-loader-overlay">
      <div className="page-loader-content">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
      <style jsx>{`
        .page-loader-overlay {
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
        }

        .page-loader-content {
          text-align: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f0f0f0;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        p {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .spinner {
            width: 40px;
            height: 40px;
            border-width: 3px;
          }

          p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
