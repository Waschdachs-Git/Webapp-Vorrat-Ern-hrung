import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Package,
  ShoppingCart,
  CookingPot,
  User,
  type LucideIcon,
} from 'lucide-react';
import { cx } from './ui';

interface Tab {
  to: string;
  label: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { to: '/heute', label: 'Heute', icon: Home },
  { to: '/vorrat', label: 'Vorrat', icon: Package },
  { to: '/einkauf', label: 'Einkauf', icon: ShoppingCart },
  { to: '/rezepte', label: 'Rezepte', icon: CookingPot },
  { to: '/profil', label: 'Profil', icon: User },
];

/** Bottom tab bar – primary navigation, thumb-reachable, 44px+ targets. */
export function TabBar(): ReactNode {
  return (
    <nav className="border-t border-border bg-surface/95 pb-safe backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-stretch justify-around">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cx(
                'flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 pt-2 transition-colors',
                isActive ? 'text-accent' : 'text-faint',
              )
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[11px] font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
