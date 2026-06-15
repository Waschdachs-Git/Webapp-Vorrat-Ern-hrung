import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clampPct } from '@/lib/nutrition';
import type { Nutriments, Targets } from '@/db/types';

interface MacroDef {
  key: 'protein' | 'carbs' | 'fat';
  label: string;
  colorClass: string;
}

const MACROS: MacroDef[] = [
  { key: 'protein', label: 'Protein', colorClass: 'bg-protein' },
  { key: 'carbs', label: 'Kohlenhydrate', colorClass: 'bg-carbs' },
  { key: 'fat', label: 'Fett', colorClass: 'bg-fat' },
];

export function MacroBars({
  consumed,
  targets,
}: {
  consumed: Nutriments;
  targets: Targets;
}): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      {MACROS.map((m) => {
        const value = consumed[m.key];
        const goal = targets[m.key];
        const pct = clampPct(value, goal);
        return (
          <div key={m.key}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-muted">
                {m.label}
              </span>
              <span className="tnum text-[12px] text-faint">
                {Math.round(value)} / {Math.round(goal)} g
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className={`h-full rounded-full ${m.colorClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 140, damping: 22 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
