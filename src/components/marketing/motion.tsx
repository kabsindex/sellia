import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';

export const easeOut = [0.22, 1, 0.36, 1] as const;

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
 * Scénario en boucle : renvoie l'étape courante. La boucle ne tourne que lorsque
 * l'élément est visible ; avec « réduire les animations », l'état final reste affiché.
 */
export function useScript(durations: number[]) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const [step, setStep] = useState(reduce ? durations.length - 1 : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current + 1) % durations.length),
      durations[step]
    );
    return () => window.clearTimeout(timer);
  }, [step, inView, reduce, durations]);

  return { ref, step, setStep, reduce: Boolean(reduce) };
}
