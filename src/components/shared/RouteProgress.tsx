import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

const MIN_DURATION_MS = 420;

export function RouteProgress() {
  const location = useLocation();
  const firstRender = useRef(true);
  const timerRef = useRef<number>();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 120,
      minimum: 0.18
    });
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    window.clearTimeout(timerRef.current);
    NProgress.start();
    timerRef.current = window.setTimeout(() => NProgress.done(), MIN_DURATION_MS);

    return () => {
      window.clearTimeout(timerRef.current);
      NProgress.done();
    };
  }, [location.key]);

  return null;
}
