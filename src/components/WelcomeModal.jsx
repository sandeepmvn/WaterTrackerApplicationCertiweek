import { useState } from 'react';

export default function WelcomeModal({ isDark, onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    onSubmit(trimmedName);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm rounded-3xl p-8 text-left transition-all duration-300 ${
          isDark
            ? 'bg-gray-800 shadow-2xl shadow-black/60 ring-1 ring-white/10'
            : 'bg-white shadow-xl shadow-blue-100/80'
        }`}
      >
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Welcome to Water Tracker
        </h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Let&apos;s personalize your hydration journey.
        </p>

        <label
          htmlFor="user-name"
          className={`mt-6 block text-xs font-semibold uppercase tracking-wide ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Your name
        </label>
        <input
          id="user-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Alex"
          className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
              : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
          }`}
          autoFocus
        />

        <button
          type="submit"
          disabled={!name.trim()}
          className={`mt-6 w-full rounded-xl py-3 text-base font-semibold text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50'
              : 'bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-200'
          }`}
        >
          Get started
        </button>
      </form>
    </div>
  );
}
