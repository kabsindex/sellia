import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { ease } from '../../design/motion';

/** Apparition discrète au scroll (une seule fois), désactivée avec « réduire les animations ». */
export function Reveal({ children, className, delay = 0 }: {children: React.ReactNode;className?: string;delay?: number;}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease }}>
      {children}
    </motion.div>);
}

/** Nombre qui glisse de sa valeur précédente vers la nouvelle (total, compteurs, chiffre d'affaires). */
export function AnimatedNumber({ value, prefix = '', suffix = '' }: {value: number;prefix?: string;suffix?: string;}) {
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
      duration: 0.55,
      ease: 'easeOut',
      onUpdate: (latest) => setShown(Math.round(latest * 100) / 100)
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <span className="tabular-nums">{prefix}{Number.isInteger(shown) ? shown : shown.toFixed(2)}{suffix}</span>;
}

/**
 * Scénario en boucle (démos produit). Ne tourne que lorsque l'élément est visible ;
 * avec « réduire les animations », l'état final reste affiché sans boucle.
 */
export function useScript(durations: number[]) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const [step, setStep] = useState(reduce ? durations.length - 1 : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    const timer = window.setTimeout(() => setStep((current) => (current + 1) % durations.length), durations[step]);
    return () => window.clearTimeout(timer);
  }, [step, inView, reduce, durations]);

  return { ref, step, setStep, reduce: Boolean(reduce) };
}
