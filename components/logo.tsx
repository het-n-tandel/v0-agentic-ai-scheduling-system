"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Microphone body */}
        <rect x="35" y="25" width="30" height="40" rx="15" fill="url(#micGradient)" stroke="#1e40af" strokeWidth="2" />

        {/* Microphone grille */}
        <line x1="40" y1="35" x2="60" y2="35" stroke="#1e40af" strokeWidth="1.5" opacity="0.7" />
        <line x1="40" y1="40" x2="60" y2="40" stroke="#1e40af" strokeWidth="1.5" opacity="0.7" />
        <line x1="40" y1="45" x2="60" y2="45" stroke="#1e40af" strokeWidth="1.5" opacity="0.7" />
        <line x1="40" y1="50" x2="60" y2="50" stroke="#1e40af" strokeWidth="1.5" opacity="0.7" />
        <line x1="40" y1="55" x2="60" y2="55" stroke="#1e40af" strokeWidth="1.5" opacity="0.7" />

        {/* Microphone stand */}
        <rect x="48" y="65" width="4" height="15" fill="#374151" />
        <rect x="40" y="78" width="20" height="4" rx="2" fill="#374151" />

        {/* AI Spark/Lightning */}
        <path
          d="M70 20 L75 30 L72 30 L77 40 L70 35 L73 35 L68 25 Z"
          fill="url(#sparkGradient)"
          className="animate-pulse"
        />

        {/* Sound waves */}
        <path
          d="M25 35 Q20 40 20 45 Q20 50 25 55"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          className="animate-pulse"
        />
        <path
          d="M15 30 Q8 40 8 45 Q8 50 15 60"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
          className="animate-pulse"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
