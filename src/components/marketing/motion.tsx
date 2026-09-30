import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';

export const easeOut = [0.22, 1, 0.36, 1] as const;

function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(() => document.visibilityState !== 'hidden');

  useEffect(() => {
    const update = () => setIsVisible(document.visibilityState !== 'hidden');

    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return isVisible;
}

/** Apparition discrète au scroll (une seule fois). Désactivée si l'utilisateur réduit les animations. */
export function Reveal({
  children,
  className,
  delay = 0
}: {children: React.ReactNode;className?: string;delay?: number;}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay, ease: easeOut }}>
      {children}
    </motion.div>);
}

/** Nombre qui passe de sa valeur précédente à la nouvelle. */
export function AnimatedNumber({
  value,
  prefix = '',
  suffix = ''
}: {value: number;prefix?: string;suffix?: string;}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: (latest) => setShown(Math.round(latest))
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <span className="tabular-nums">{prefix}{shown}{suffix}</span>;
}

/**
 * Scénario en boucle : renvoie l'étape courante. Les démonstrations restent actives
 * quelle que soit la taille du viewport et sont suspendues lorsque l'onglet est masqué.
 */
export function useScript(durations: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const pageVisible = usePageVisibility();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!pageVisible) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current + 1) % durations.length),
      durations[step]
    );
    return () => window.clearTimeout(timer);
  }, [step, pageVisible, durations]);

  return { ref, step, setStep, reduce: false };
}
