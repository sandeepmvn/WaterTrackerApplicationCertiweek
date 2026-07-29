import { useState } from 'react';

const MIN_AMOUNT = 0;
const MAX_AMOUNT = 32;
const STEP_AMOUNT = 4;

export default function AmountSlider({ isDark, onAdd }) {
  const [pendingAmount, setPendingAmount] = useState(0);

  const handleAdd = () => {
    if (pendingAmount === 0) {
      return;
    }

    onAdd(pendingAmount);
    setPendingAmount(0);
  };

  return (
    <div
      className={`mb-5 rounded-2xl p-4 text-left transition-all duration-300 ${
        isDark
          ? 'bg-gray-900/60 ring-1 ring-white/10'
          : 'bg-sky-50 ring-1 ring-blue-100'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Quick add
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Add {pendingAmount} oz with one tap.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={pendingAmount === 0}
          className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40'
              : 'bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-200'
          }`}
        >
          Add {pendingAmount} oz
        </button>
      </div>

      <input
        type="range"
        min={MIN_AMOUNT}
        max={MAX_AMOUNT}
        step={STEP_AMOUNT}
        value={pendingAmount}
        onChange={(event) => setPendingAmount(Number(event.target.value))}
        className="mt-4 w-full accent-blue-500"
      />

      <div className={`mt-2 flex justify-between text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <span>{MIN_AMOUNT} oz</span>
        <span>{MAX_AMOUNT} oz</span>
      </div>
    </div>
  );
}
