import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

export default function LoadingSpinner() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // true = spinner visible, content hidden
  const loadingTimeoutRef = useRef(null);
  const observerRef = useRef(null);

  const waitForPriorityImages = () => {
    return new Promise((resolve) => {
      let resolved = false;
      const safeResolve = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      const checkImages = () => {
        const priorityImages = document.querySelectorAll('img[data-priority="true"]');
        if (priorityImages.length === 0) return;

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
          if (observerRef.current) observerRef.current.disconnect();
          safeResolve();
        });
      };

      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      observerRef.current = new MutationObserver(checkImages);
      observerRef.current.observe(document.body, { childList: true, subtree: true });

      checkImages();

      setTimeout(() => {
        if (document.querySelectorAll('img[data-priority="true"]').length === 0) {
          safeResolve();
        }
      }, 250);
    });
  };

  const finishLoading = () => {
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    if (observerRef.current) observerRef.current.disconnect();
    setLoading(false);
  };

  const startLoadingSequence = () => {
    const startTime = Date.now();
    const MIN_VISIBLE_MS = 500;

    waitForPriorityImages().then(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      setTimeout(finishLoading, remaining);
    });

    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(finishLoading, 3500);
  };

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      startLoadingSequence();
    };

    const handleError = () => {
      finishLoading();
    };

    if (document.readyState === 'complete') {
      startLoadingSequence();
    } else {
      window.addEventListener('load', startLoadingSequence, { once: true });
    }

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
      window.removeEventListener('load', startLoadingSequence);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [router]);

  useEffect(() => {
    const el = document.getElementById('smooth-content');
    if (!el) return;
    if (loading) {
      el.classList.remove('content-visible');
    } else {
      el.classList.add('content-visible');
    }
  }, [loading]);

  return (
    <>
      <div className={`loading-spinner-overlay ${loading ? 'is-visible' : ''}`}>
        <div className="loading-spinner-container">
          <div className="spinner"></div>
        </div>
      </div>

      <style jsx global>{`
        .loading-spinner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fafaf9;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 300ms ease-out;
        }

        .loading-spinner-overlay.is-visible {
          opacity: 1;
          pointer-events: auto;
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
          border: 3px solid rgba(46, 90, 172, 0.15);
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

        #smooth-content {
          opacity: 0;
          transition: opacity 300ms ease-out;
        }

        #smooth-content.content-visible {
          opacity: 1;
        }
      `}</style>
    </>
  );
}
