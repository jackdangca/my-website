
export default function Logo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Custom portfolio logo with initials XD"
    >
     
      <polygon
        points="32,3 58,17.5 58,46.5 32,61 6,46.5 6,17.5"
        fill="#0d9488"
        stroke="#0f766e"
        strokeWidth="2"
      />
     
      <polygon points="32,10 50,20.5 50,43.5 32,54 14,43.5 14,20.5" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" />
      {/* Initials */}
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="21"
        fontWeight="bold"
        fill="#ffffff"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        XD
      </text>
    </svg>
  )
}
