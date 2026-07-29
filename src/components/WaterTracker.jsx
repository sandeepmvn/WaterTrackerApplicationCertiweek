import { useEffect, useRef } from 'react';
import AmountSlider from './AmountSlider';
import BadgesPanel from './BadgesPanel';
import ToastStack from './ToastStack';
import WelcomeModal from './WelcomeModal';
import { useDarkMode } from '../hooks/useDarkMode';
import { useWaterData } from '../hooks/useWaterData';
import { useToasts } from '../hooks/useToasts';

const STEP_OZ = 8;
const CUP_EMOJI = '💧';
const PROGRESS_MILESTONES = [25, 50, 75, 100];

export default function WaterTracker() {
  const [isDark, toggleDark] = useDarkMode();
  const {
    userName,
    setUserName,
    age,
    setAge,
    oz,
    goalOz,
    addOz,
    decrementOz,
    resetOz,
    streak,
    badges,
    justEarned,
    clearJustEarned,
  } = useWaterData();
  const { toasts, pushToast } = useToasts();

  const shownMilestonesRef = useRef(new Set());
  const previousStreakRef = useRef(streak);

  const progress = Math.min((oz / goalOz) * 100, 100);
  const goalMet = oz >= goalOz;
  const cups = Math.floor(oz / STEP_OZ);
  const totalCups = Math.ceil(goalOz / STEP_OZ);

  useEffect(() => {
    if (justEarned.length === 0) {
      return;
    }

    justEarned.forEach((badge) => {
      pushToast(`Badge unlocked: ${badge.icon} ${badge.label}`);
    });
    clearJustEarned();
  }, [clearJustEarned, justEarned, pushToast]);

  useEffect(() => {
    const roundedProgress = Math.round(progress);

    if (roundedProgress === 0) {
      shownMilestonesRef.current = new Set();
      return;
    }

    PROGRESS_MILESTONES.forEach((milestone) => {
      if (
        roundedProgress >= milestone &&
        !shownMilestonesRef.current.has(milestone)
      ) {
        shownMilestonesRef.current.add(milestone);

        if (milestone === 100) {
          pushToast('🎉 Hydration goal complete for today!');
        } else {
          pushToast(`Nice work! You reached ${milestone}% of today’s goal.`);
        }
      }
    });
  }, [progress, pushToast]);

  useEffect(() => {
    if (previousStreakRef.current !== streak && streak > previousStreakRef.current && streak > 0) {
      pushToast(`🔥 ${streak}-day streak and counting!`);
    }

    previousStreakRef.current = streak;
  }, [pushToast, streak]);

  const handleAgeChange = (e) => {
    const val = e.target.value;
    if (val === '' || (Number(val) >= 1 && Number(val) <= 120)) {
      setAge(val);
    }
  };

  const accentColor = goalMet
    ? (isDark ? '#4ade80' : '#16a34a')
    : (isDark ? '#60a5fa' : '#3b82f6');

  const barColor = goalMet
    ? (isDark ? '#22c55e' : '#16a34a')
    : (isDark ? '#3b82f6' : '#3b82f6');

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-100'
    }`}>
      {!userName && <WelcomeModal isDark={isDark} onSubmit={setUserName} />}
      <ToastStack toasts={toasts} />
      <div className={`rounded-3xl w-full max-w-sm text-center transition-all duration-300 ${
        isDark
          ? 'bg-gray-800 shadow-2xl shadow-black/60 ring-1 ring-white/10'
          : 'bg-white shadow-xl shadow-blue-100/80'
      } p-8`}>

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h1 className={`text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Water Tracker
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
              {userName ? `Hi ${userName}, stay hydrated 💧` : 'Stay hydrated 💧'}
            </p>
          </div>
          <button
            onClick={toggleDark}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all active:scale-90 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Age input */}
        <div className="mb-5">
          <label className={`block text-xs font-semibold mb-1.5 text-left tracking-wide uppercase ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Your Age
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={handleAgeChange}
            placeholder="e.g. 25"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
            }`}
          />
          <p className={`text-xs mt-1.5 text-left ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {age
              ? `Recommended for age ${age}: ${goalOz} oz / day`
              : 'Default goal: 64 oz / day'}
          </p>
        </div>

        {/* Oz display */}
        <div className={`rounded-2xl py-6 px-4 mb-5 transition-all duration-500 ${
          goalMet
            ? isDark ? 'bg-green-900/40 ring-1 ring-green-700/50' : 'bg-green-50'
            : isDark ? 'bg-blue-900/30 ring-1 ring-blue-700/30' : 'bg-blue-50'
        }`}>
          <div
            className="text-6xl font-extrabold tracking-tight mb-1 transition-colors duration-300"
            style={{ color: accentColor }}
          >
            {oz}
          </div>
          <div className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            ounces consumed
          </div>
          <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
            {cups} cup{cups !== 1 ? 's' : ''} ·{' '}
            {goalOz - oz > 0 ? `${goalOz - oz} oz to go` : '🎉 Goal reached!'}
          </div>
        </div>

        <div className="mb-5">
          <div className={`mb-1.5 flex items-center justify-between gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span>0 oz</span>
            <span className="font-medium" style={{ color: accentColor }}>{Math.round(progress)}%</span>
            <span>{goalOz} oz</span>
          </div>
          <div className={`w-full rounded-full h-3 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: barColor }}
            />
          </div>
          {streak > 0 && (
            <div className="mt-3 flex justify-start">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isDark
                  ? 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20'
                  : 'bg-orange-50 text-orange-600 ring-1 ring-orange-100'
              }`}>
                🔥 {streak}-day streak
              </span>
            </div>
          )}
        </div>

        {/* Cup indicators */}
        <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
          {Array.from({ length: totalCups }).map((_, i) => (
            <span
              key={i}
              className={`text-lg transition-all duration-300 ${i < cups ? 'opacity-100 scale-110' : isDark ? 'opacity-20' : 'opacity-25'}`}
            >
              {CUP_EMOJI}
            </span>
          ))}
        </div>

        {/* +/- Buttons */}
        <div className="flex gap-3 mb-3">
          <button
            onClick={() => decrementOz(STEP_OZ)}
            disabled={oz === 0}
            className={`flex-1 py-3 rounded-xl text-base font-semibold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60 ring-1 ring-red-800/50'
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            }`}
          >
            − 8 oz
          </button>
          <button
            onClick={() => addOz(STEP_OZ)}
            className={`flex-1 py-3 rounded-xl text-base font-semibold text-white transition-all active:scale-95 ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50'
                : 'bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-200'
            }`}
          >
            + 8 oz
          </button>
        </div>

        <AmountSlider isDark={isDark} onAdd={addOz} />
        <BadgesPanel earnedBadgeIds={badges} isDark={isDark} />

        <button
          onClick={resetOz}
          className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
            isDark
              ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          Reset day
        </button>
      </div>
    </div>
  );
}
