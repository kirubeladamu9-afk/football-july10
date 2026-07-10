import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

export default function LoadingSpinner() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const loadingTimeoutRef = useRef(null);
  const observerRef = useRef(null);

  const waitForPriorityImages = () => {
    return new Promise((resolve) => {
      const checkImages = () => {
        const priorityImages = document.querySelectorAll('img[data-priority="true"]');

        if (priorityImages.length === 0) {
          resolve();
          return;
        }

        const promises = Array.from(priorityImages).map((img) => {
          return new Promise((imgResolve) => {
            if (img.complete && img.naturalHeight !== 0) {
              imgResolve();
            } else {
              const onLoad = () => {
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onLoad);
                imgResolve();
              };
              img.addEventListener('load', onLoad);
              img.addEventListener('error', onLoad);
            }
          });
        });

        Promise.all(promises).then(() => {
          resolve();
        });
      };

      // Use MutationObserver to detect when images are added to DOM
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new MutationObserver(() => {
        checkImages();
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Initial check
      checkImages();
    });
  };

  const hideLoadingSpinner = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    setIsLoading(false);
    setIsInitialLoad(false);
  };

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      // Wait for images to load after route change
      waitForPriorityImages().then(() => {
        hideLoadingSpinner();
      });

      // Fallback: hide spinner after 3.5 seconds max
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      loadingTimeoutRef.current = setTimeout(() => {
        hideLoadingSpinner();
      }, 3500);
    };

    const handleError = () => {
      hideLoadingSpinner();
    };

    // Handle initial page load
    const initLoad = async () => {
      if (document.readyState === 'complete') {
        await waitForPriorityImages();
        hideLoadingSpinner();
      } else {
        window.addEventListener('load', async () => {
          await waitForPriorityImages();
          hideLoadingSpinner();
        });
      }

      // Fallback for initial load
      loadingTimeoutRef.current = setTimeout(() => {
        hideLoadingSpinner();
      }, 3500);
    };

    initLoad();

    // Listen for route changes
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [router]);

  return (
    <>
      {isLoading && (
        <div className={`loading-spinner-overlay ${!isInitialLoad ? 'fade-out' : ''}`}>
          <div className="loading-spinner-container">
            <div className="spinner"></div>
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
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 1;
          transition: opacity 300ms ease-out;
        }

        .loading-spinner-overlay.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(46, 90, 172, 0.2);
          border-top: 3px solid #2e5aac;
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
      `}</style>
    </>
  );
}
