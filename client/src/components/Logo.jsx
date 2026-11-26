import { useId } from 'react'

/* The monogram carries the site's spectral gradient, so the identity reads as
   bright and technical in both themes. `useId` keeps the gradient reference
   unique even when the logo appears in the header and the footer. */

export default function Logo({ size = 40, className = '' }) {
  const id = useId()
  const fillId = `logo-fill-${id}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Xiaoxing Dang monogram"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--c-violet)" />
          <stop offset="52%" stopColor="var(--c-blue)" />
          <stop offset="100%" stopColor="var(--c-cyan)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="11" fill={`url(#${fillId})`} />
      <rect x="1.6" y="1.6" width="44.8" height="44.8" rx="10.4" fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="1.2" />
      <path d="M7.5 14.5 17 25.5M17 14.5 7.5 25.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M24 14v11.5M24 14c6.4 0 10 2.6 10 5.75S30.4 25.5 24 25.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="35" r="3" fill="#ff5fb4" />
    </svg>
  )
}
