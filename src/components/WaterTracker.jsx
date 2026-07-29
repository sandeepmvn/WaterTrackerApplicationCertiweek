import { useState } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

const STEP_OZ = 8;
const CUP_EMOJI = '💧';

function calculateGoal(age) {
  const a = Number(age);
  if (!a || a < 1) return 64;
  if (a <= 3)  return 32;
  if (a <= 8)  return 40;
  if (a <= 13) return 56;
  if (a <= 18) return 72;
  if (a <= 50) return 80;
  if (a <= 65) return 72;
  return 64;
}

export default function WaterTracker() {
  const [isDark, toggleDark] = useDarkMode();
  const [oz, setOz] = useState(0);
  const [age, setAge] = useState('');

  const goalOz = calculateGoal(age);
  const progress = Math.min((oz / goalOz) * 100, 100);
  const goalMet = oz >= goalOz;
  const cups = Math.floor(oz / STEP_OZ);
  const totalCups = Math.ceil(goalOz / STEP_OZ);

  const increment = () => setOz((prev) => prev + STEP_OZ);
  const decrement = () => setOz((prev) => Math.max(0, prev - STEP_OZ));
  const reset = () => setOz(0);

  const handleAgeChange = (e) => {
    const val = e.target.value;
    if (val === '' || (Number(val) >= 1 && Number(val) <= 120)) {
      setAge(val);
      setOz(0);
    }
  };

  // Inline colors that adapt to dark mode
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
              Stay hydrated 💧
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

        {/* Progress bar */}
        <div className="mb-5">
          <div className={`flex justify-between text-xs mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
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
            onClick={decrement}
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
            onClick={increment}
            className={`flex-1 py-3 rounded-xl text-base font-semibold text-white transition-all active:scale-95 ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50'
                : 'bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-200'
            }`}
          >
            + 8 oz
          </button>
        </div>

        <button
          onClick={reset}
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


