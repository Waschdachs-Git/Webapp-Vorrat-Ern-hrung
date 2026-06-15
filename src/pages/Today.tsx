import { type ReactNode, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Sparkles, AlarmClock, Shuffle } from 'lucide-react';
import { db } from '@/db/database';
import { PageHeader } from '@/components/PageHeader';
import { CalorieRing } from '@/components/CalorieRing';
import { MacroBars } from '@/components/MacroBars';
import { LogFoodSheet } from '@/components/LogFoodSheet';
import { Button, Card, EmptyState } from '@/components/ui';
import { useToday } from '@/hooks/useToday';
import { defaultMealType } from '@/lib/actions';
import { formatTime } from '@/lib/date';
import { buildRecommendations, type Recommendation } from '@/lib/recommendations';
import type { DiaryEntry, MealType } from '@/db/types';

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Frühstück',
  lunch: 'Mittag',
  dinner: 'Abend',
  snack: 'Snack',
};

export function Today(): ReactNode {
  const { targets, consumed, remaining, entries, profile } = useToday();
  const [logOpen, setLogOpen] = useState(false);

  const inventory = useLiveQuery(() => db.inventory.toArray(), []);
  const foods = useLiveQuery(() => db.foodsLocal.toArray(), []);
  const recipes = useLiveQuery(() => db.recipesOwn.toArray(), []);
  const recentDiary = useLiveQuery(
    () => db.diary.orderBy('datetime').reverse().limit(20).toArray(),
    [],
  );

  const recs = useMemo<Recommendation[]>(() => {
    if (!profile) return [];
    return buildRecommendations({
      remaining,
      inventory: inventory ?? [],
      foods: foods ?? [],
      recipes: recipes ?? [],
      recentDiary: recentDiary ?? [],
    });
  }, [profile, remaining, inventory, foods, recipes, recentDiary]);

  const todayLabel = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const byMeal = groupByMeal(entries);

  return (
    <div className="pb-24">
      <PageHeader title="Heute" subtitle={todayLabel} />

      <div className="px-5">
        <Card className="flex flex-col items-center gap-5 py-6">
          <CalorieRing consumed={consumed.kcal} goal={targets.kcal} />
          <div className="w-full">
            <MacroBars consumed={consumed} targets={targets} />
          </div>
          <div className="grid w-full grid-cols-4 gap-2 border-t border-border pt-4 text-center">
            <Remain label="kcal" value={remaining.kcal} />
            <Remain label="Protein" value={remaining.protein} unit="g" />
            <Remain label="Carbs" value={remaining.carbs} unit="g" />
            <Remain label="Fett" value={remaining.fat} unit="g" />
          </div>
        </Card>

        {recs.length > 0 && (
          <section className="mt-5">
            <SectionTitle>Empfehlungen</SectionTitle>
            <div className="flex flex-col gap-2">
              {recs.map((r) => (
                <RecommendationCard key={r.id} rec={r} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <SectionTitle>Mahlzeiten</SectionTitle>
            <Button onClick={() => setLogOpen(true)} className="h-9 px-3">
              <Plus size={18} /> Loggen
            </Button>
          </div>

          {entries.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Sparkles size={26} />}
                title="Noch nichts gegessen heute"
                hint="Tippe auf „Loggen“, um deine erste Mahlzeit hinzuzufügen."
              />
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {(Object.keys(byMeal) as MealType[])
                .filter((m) => byMeal[m].length > 0)
                .map((meal) => (
                  <Card key={meal}>
                    <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-faint">
                      {MEAL_LABELS[meal]}
                    </p>
                    <div className="flex flex-col gap-2">
                      {byMeal[meal].map((entry) =>
                        entry.items.map((item, idx) => (
                          <div
                            key={`${entry.id}-${idx}`}
                            className="flex items-center justify-between"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-[15px] text-text">
                                {item.name}
                              </p>
                              <p className="text-[12px] text-faint">
                                {item.amount} {item.unit} ·{' '}
                                {formatTime(entry.datetime)}
                              </p>
                            </div>
                            <span className="tnum shrink-0 pl-3 text-[15px] font-medium text-text">
                              {Math.round(item.kcal)} kcal
                            </span>
                          </div>
                        )),
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </section>
      </div>

      <LogFoodSheet
        open={logOpen}
        onClose={() => setLogOpen(false)}
        defaultMeal={defaultMealType()}
      />
    </div>
  );
}

function Remain({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit?: string;
}): ReactNode {
  return (
    <div>
      <p
        className={`tnum text-[16px] font-semibold ${value < 0 ? 'text-warn' : 'text-text'}`}
      >
        {value}
        {unit ? ` ${unit}` : ''}
      </p>
      <p className="text-[11px] text-faint">{label} übrig</p>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }): ReactNode {
  return (
    <h2 className="mb-2 text-[15px] font-semibold text-text">{children}</h2>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }): ReactNode {
  const icon =
    rec.kind === 'goal' ? (
      <Sparkles size={18} />
    ) : rec.kind === 'expiring' ? (
      <AlarmClock size={18} />
    ) : (
      <Shuffle size={18} />
    );
  return (
    <Card className="flex items-start gap-3">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-text">{rec.title}</p>
        <p className="text-[13px] text-muted">{rec.detail}</p>
      </div>
    </Card>
  );
}

function groupByMeal(entries: DiaryEntry[]): Record<MealType, DiaryEntry[]> {
  const groups: Record<MealType, DiaryEntry[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };
  for (const e of [...entries].sort((a, b) =>
    a.datetime.localeCompare(b.datetime),
  )) {
    groups[e.mealType].push(e);
  }
  return groups;
}
