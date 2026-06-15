import { type ReactNode, useState } from 'react';
import { Button, Field, Input, Select, SegmentedControl } from './ui';
import { ACTIVITY_LABELS, GOAL_LABELS } from '@/lib/health';
import type {
  ActivityLevel,
  Goal,
  Profile,
  Sex,
} from '@/db/types';

export interface ProfileDraft {
  name: string;
  sex: Sex;
  birthdate: string;
  heightCm: string;
  weightKg: string;
  activityLevel: ActivityLevel;
  goal: Goal;
  targetRateKgPerWeek: string;
  allergies: string;
  dietPrefs: string;
}

export function emptyDraft(): ProfileDraft {
  return {
    name: '',
    sex: 'd',
    birthdate: '',
    heightCm: '',
    weightKg: '',
    activityLevel: 'moderate',
    goal: 'maintain',
    targetRateKgPerWeek: '0.5',
    allergies: '',
    dietPrefs: '',
  };
}

export function draftFromProfile(p: Profile): ProfileDraft {
  return {
    name: p.name,
    sex: p.sex,
    birthdate: p.birthdate,
    heightCm: String(p.heightCm),
    weightKg: String(p.weightKg),
    activityLevel: p.activityLevel,
    goal: p.goal,
    targetRateKgPerWeek: String(p.targetRateKgPerWeek),
    allergies: p.allergies.join(', '),
    dietPrefs: p.dietPrefs.join(', '),
  };
}

export function draftToProfile(d: ProfileDraft, id: number): Profile {
  return {
    id,
    name: d.name.trim() || 'Ich',
    sex: d.sex,
    birthdate: d.birthdate,
    heightCm: parseFloat(d.heightCm) || 0,
    weightKg: parseFloat(d.weightKg) || 0,
    activityLevel: d.activityLevel,
    goal: d.goal,
    targetRateKgPerWeek: parseFloat(d.targetRateKgPerWeek) || 0,
    allergies: splitList(d.allergies),
    dietPrefs: splitList(d.dietPrefs),
  };
}

function splitList(s: string): string[] {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'w', label: 'Weiblich' },
  { value: 'm', label: 'Männlich' },
  { value: 'd', label: 'Divers' },
];

export function ProfileForm({
  draft,
  setDraft,
  onSubmit,
  submitLabel,
}: {
  draft: ProfileDraft;
  setDraft: (d: ProfileDraft) => void;
  onSubmit: () => void;
  submitLabel: string;
}): ReactNode {
  const [submitting, setSubmitting] = useState(false);
  const valid =
    draft.birthdate &&
    parseFloat(draft.heightCm) > 0 &&
    parseFloat(draft.weightKg) > 0;

  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  const set = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) =>
    setDraft({ ...draft, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Name">
        <Input value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="Wie heißt du?" />
      </Field>

      <Field label="Geschlecht">
        <SegmentedControl
          value={draft.sex}
          onChange={(v) => set('sex', v)}
          options={SEX_OPTIONS}
        />
      </Field>

      <Field label="Geburtsdatum">
        <Input
          type="date"
          value={draft.birthdate}
          onChange={(e) => set('birthdate', e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Größe (cm)">
          <Input
            type="number"
            inputMode="decimal"
            value={draft.heightCm}
            onChange={(e) => set('heightCm', e.target.value)}
          />
        </Field>
        <Field label="Gewicht (kg)">
          <Input
            type="number"
            inputMode="decimal"
            value={draft.weightKg}
            onChange={(e) => set('weightKg', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Aktivitätslevel">
        <Select
          value={draft.activityLevel}
          onChange={(e) => set('activityLevel', e.target.value as ActivityLevel)}
        >
          {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((k) => (
            <option key={k} value={k}>
              {ACTIVITY_LABELS[k]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Ziel">
        <SegmentedControl
          value={draft.goal}
          onChange={(v) => set('goal', v)}
          options={(Object.keys(GOAL_LABELS) as Goal[]).map((k) => ({
            value: k,
            label: GOAL_LABELS[k],
          }))}
        />
      </Field>

      {draft.goal !== 'maintain' && (
        <Field
          label="Zielrate (kg pro Woche)"
          hint="Empfohlen: 0,25–0,75 kg/Woche."
        >
          <Input
            type="number"
            inputMode="decimal"
            step="0.25"
            value={draft.targetRateKgPerWeek}
            onChange={(e) => set('targetRateKgPerWeek', e.target.value)}
          />
        </Field>
      )}

      <Field label="Allergien" hint="Komma-getrennt, z. B. Nüsse, Laktose">
        <Input value={draft.allergies} onChange={(e) => set('allergies', e.target.value)} />
      </Field>

      <Field label="Ernährungsvorlieben" hint="Komma-getrennt, z. B. vegetarisch">
        <Input value={draft.dietPrefs} onChange={(e) => set('dietPrefs', e.target.value)} />
      </Field>

      <Button block disabled={!valid || submitting} onClick={submit} className="mt-1">
        {submitLabel}
      </Button>
    </div>
  );
}
