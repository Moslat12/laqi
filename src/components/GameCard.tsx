interface GameCardProps {
  title: string
  description: string
  icon: string
  players: string
  color: string
  href: string
}

export default function GameCard({ title, description, icon, players, color }: GameCardProps) {
  return (
    <div className="game-card group">
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 ${color}`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-laqi-text mb-2 group-hover:text-laqi-neon transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-laqi-muted text-sm leading-relaxed mb-4">
        {description}
      </p>

      {/* Players Info */}
      <div className="flex items-center gap-2 text-xs text-laqi-muted">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>{players}</span>
      </div>
    </div>
  )
}
