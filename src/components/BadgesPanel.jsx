import { BADGE_DEFINITIONS } from '../hooks/useWaterData';

export default function BadgesPanel({ earnedBadgeIds, isDark }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Badges
        </h2>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {earnedBadgeIds.length}/{BADGE_DEFINITIONS.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {BADGE_DEFINITIONS.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              title={badge.description}
              className={`rounded-2xl p-3 text-left transition-all duration-300 ${
                isEarned
                  ? isDark
                    ? 'bg-amber-500/15 ring-1 ring-amber-400/30'
                    : 'bg-amber-50 ring-1 ring-amber-100'
                  : isDark
                    ? 'bg-gray-900/50 opacity-30 ring-1 ring-white/10'
                    : 'bg-gray-50 opacity-40 ring-1 ring-gray-100'
              }`}
            >
              <div className="text-xl">{badge.icon}</div>
              <div className={`mt-2 text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                {badge.label}
              </div>
              <div className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {badge.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
