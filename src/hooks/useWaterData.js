import { useEffect, useMemo, useState } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

const STORAGE_PREFIX = 'waterTracker.';
const GALLON_OZ = 128;
const MAX_STREAK_CHECK_DAYS = 3660;

export const BADGE_DEFINITIONS = [
  {
    id: 'first-sip',
    icon: '🥤',
    label: 'First Sip',
    description: 'Meet your hydration goal for the first time.',
  },
  {
    id: '3-day-streak',
    icon: '🔥',
    label: '3-Day Streak',
    description: 'Meet your hydration goal for 3 consecutive days.',
  },
  {
    id: 'week-warrior',
    icon: '🏆',
    label: 'Week Warrior',
    description: 'Meet your hydration goal for 7 consecutive days.',
  },
  {
    id: 'month-master',
    icon: '👑',
    label: 'Month Master',
    description: 'Meet your hydration goal for 30 consecutive days.',
  },
  {
    id: 'gallon-guru',
    icon: '🌊',
    label: 'Gallon Guru',
    description: 'Log 10 lifetime gallons of water.',
  },
];

const BADGE_UNLOCK_CHECKS = {
  'first-sip': ({ hasAnyGoalMet }) => hasAnyGoalMet,
  '3-day-streak': ({ streak }) => streak >= 3,
  'week-warrior': ({ streak }) => streak >= 7,
  'month-master': ({ streak }) => streak >= 30,
  'gallon-guru': ({ totalLifetimeOz }) => totalLifetimeOz >= 10 * GALLON_OZ,
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getPreviousDayKey(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function calculateGoal(age) {
  const numericAge = Number(age);
  if (!numericAge || numericAge < 1) return 64;
  if (numericAge <= 3) return 32;
  if (numericAge <= 8) return 40;
  if (numericAge <= 13) return 56;
  if (numericAge <= 18) return 72;
  if (numericAge <= 50) return 80;
  if (numericAge <= 65) return 72;
  return 64;
}

function normalizeHistoryValue(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce((accumulator, [dateKey, entry]) => {
    if (!entry || typeof entry !== 'object') {
      return accumulator;
    }

    const oz = Number(entry.oz) || 0;
    const goalOz = Number(entry.goalOz) || 64;

    accumulator[dateKey] = {
      oz,
      goalOz,
    };

    return accumulator;
  }, {});
}

function normalizeBadgeValue(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const validBadgeIds = new Set(BADGE_DEFINITIONS.map((badge) => badge.id));
  return value.filter((badgeId) => validBadgeIds.has(badgeId));
}

export function useWaterData() {
  const [userName, setUserName] = useLocalStorageState(`${STORAGE_PREFIX}userName`, '');
  const [age, setAge] = useLocalStorageState(`${STORAGE_PREFIX}age`, '');
  const [history, setHistory] = useLocalStorageState(`${STORAGE_PREFIX}history`, {});
  const [badges, setBadges] = useLocalStorageState(`${STORAGE_PREFIX}badges`, []);
  const [justEarned, setJustEarned] = useState([]);

  const todayKey = getTodayKey();
  const normalizedHistory = useMemo(() => normalizeHistoryValue(history), [history]);
  const normalizedBadges = useMemo(() => normalizeBadgeValue(badges), [badges]);
  const safeUserName = typeof userName === 'string' ? userName : '';
  const safeAge = typeof age === 'string' || typeof age === 'number' ? age : '';
  const goalOz = calculateGoal(safeAge);
  const oz = normalizedHistory[todayKey]?.oz ?? 0;

  useEffect(() => {
    const currentEntry = normalizedHistory[todayKey];

    if (currentEntry?.oz === oz && currentEntry?.goalOz === goalOz) {
      return;
    }

    setHistory((previousHistory) => ({
      ...normalizeHistoryValue(previousHistory),
      [todayKey]: {
        oz,
        goalOz,
      },
    }));
  }, [goalOz, normalizedHistory, oz, setHistory, todayKey]);

  const updateTodayEntry = (updater) => {
    setHistory((previousHistory) => {
      const safeHistory = normalizeHistoryValue(previousHistory);
      const currentEntry = safeHistory[todayKey] ?? { oz: 0, goalOz };
      const nextEntry = updater(currentEntry);

      return {
        ...safeHistory,
        [todayKey]: {
          oz: Math.max(0, Number(nextEntry.oz) || 0),
          goalOz: Number(nextEntry.goalOz) || goalOz,
        },
      };
    });
  };

  const addOz = (amount) => {
    const safeAmount = Math.max(0, Number(amount) || 0);
    if (safeAmount === 0) return;

    updateTodayEntry((currentEntry) => ({
      ...currentEntry,
      oz: currentEntry.oz + safeAmount,
      goalOz,
    }));
  };

  const decrementOz = (amount) => {
    const safeAmount = Math.max(0, Number(amount) || 0);
    if (safeAmount === 0) return;

    updateTodayEntry((currentEntry) => ({
      ...currentEntry,
      oz: Math.max(0, currentEntry.oz - safeAmount),
      goalOz,
    }));
  };

  const resetOz = () => {
    updateTodayEntry((currentEntry) => ({
      ...currentEntry,
      oz: 0,
      goalOz,
    }));
  };

  const updateAge = (value) => {
    setAge(value);
    updateTodayEntry(() => ({
      oz: 0,
      goalOz: calculateGoal(value),
    }));
  };

  const streak = useMemo(() => {
    let count = 0;
    let cursorKey = getPreviousDayKey(todayKey);
    let daysChecked = 0;
    const todayEntry = normalizedHistory[todayKey];
    const todayMetGoal = todayEntry && todayEntry.oz >= todayEntry.goalOz;

    if (todayMetGoal) {
      count += 1;
    }

    while (daysChecked < MAX_STREAK_CHECK_DAYS) {
      const entry = normalizedHistory[cursorKey];
      if (!entry || entry.oz < entry.goalOz) {
        break;
      }

      count += 1;
      daysChecked += 1;
      cursorKey = getPreviousDayKey(cursorKey);
    }

    return count;
  }, [normalizedHistory, todayKey]);

  const totalLifetimeOz = useMemo(
    () =>
      Object.values(normalizedHistory).reduce((sum, entry) => {
        const currentOz = Number(entry?.oz) || 0;
        return sum + currentOz;
      }, 0),
    [normalizedHistory],
  );

  const hasAnyGoalMet = useMemo(
    () => Object.values(normalizedHistory).some((entry) => entry.oz >= entry.goalOz),
    [normalizedHistory],
  );

  useEffect(() => {
    const currentStats = {
      hasAnyGoalMet,
      streak,
      totalLifetimeOz,
    };

    const newlyEarned = BADGE_DEFINITIONS.filter(
      (badge) =>
        !normalizedBadges.includes(badge.id) &&
        BADGE_UNLOCK_CHECKS[badge.id](currentStats),
    );

    if (newlyEarned.length === 0) {
      return;
    }

    const nextBadges = [...normalizedBadges, ...newlyEarned.map((badge) => badge.id)];
    setBadges(nextBadges);
    setJustEarned(newlyEarned);
  }, [hasAnyGoalMet, normalizedBadges, setBadges, streak, totalLifetimeOz]);

  const clearJustEarned = () => setJustEarned([]);

  return {
    userName: safeUserName,
    setUserName,
    age: safeAge,
    setAge: updateAge,
    history: normalizedHistory,
    oz,
    goalOz,
    addOz,
    decrementOz,
    resetOz,
    streak,
    totalLifetimeOz,
    badges: normalizedBadges,
    justEarned,
    clearJustEarned,
  };
}
