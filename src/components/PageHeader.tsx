import { type ReactNode } from 'react';

/** Consistent editorial page header with optional trailing action. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}): ReactNode {
  return (
    <header className="flex items-start justify-between gap-3 px-5 pb-3 pt-2">
      <div className="min-w-0">
        <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-text">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-[14px] text-muted">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </header>
  );
}
