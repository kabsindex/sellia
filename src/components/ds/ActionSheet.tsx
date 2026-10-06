import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ease } from '../../design/motion';

export interface SheetAction {
  label: string;
  icon: React.ComponentType<{className?: string;}>;
  onSelect: () => void;
  danger?: boolean;
}

/** Menu d'actions : feuille en bas sur mobile, carte centrée sur desktop. */
export function ActionSheet({
  open,
  title,
  subtitle,
  actions,
  onClose
}: {open: boolean;title: string;subtitle?: string;actions: SheetAction[];onClose: () => void;}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <motion.div className="absolute inset-0 bg-black/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.28, ease }}
          className="relative w-full max-w-[420px] rounded-t-[24px] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:rounded-[24px]"
          style={{ background: 'var(--ds-card)', color: 'var(--ds-ink)', boxShadow: 'var(--ds-shadow-md)' }}>
            <div className="mx-auto mb-2 h-1 w-10 rounded-full sm:hidden" style={{ background: 'var(--ds-border)' }} />
            <div className="px-3 pb-2 pt-1">
              <p className="ds-title truncate text-[16px]">{title}</p>
              {subtitle && <p className="ds-muted truncate text-[12.5px]">{subtitle}</p>}
            </div>
            {actions.map((action) =>
          <button
            key={action.label}
            type="button"
            onClick={() => {
              onClose();
              action.onSelect();
            }}
            className="flex h-12 w-full items-center gap-3 rounded-[12px] px-3 text-[14.5px] font-medium hover:bg-[var(--ds-subtle)]"
            style={{ color: action.danger ? 'var(--ds-danger)' : 'var(--ds-ink)' }}>
                <action.icon className="size-[18px]" />
                {action.label}
              </button>
          )}
          </motion.div>
        </div>
      }
    </AnimatePresence>,
    document.body
  );
}
