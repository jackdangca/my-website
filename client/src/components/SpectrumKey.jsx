/* Colour is treated as a data channel across this site, not decoration.
   This key makes that encoding explicit — the same hues appear on the
   topology nodes, project diagrams, metrics and live/interactive states. */

const KEY = [
  { hue: 'var(--c-violet)', label: 'Agent systems' },
  { hue: 'var(--c-blue)', label: 'Platform' },
  { hue: 'var(--c-cyan)', label: 'Data / events' },
  { hue: 'var(--c-amber)', label: 'Commerce' },
  { hue: 'var(--c-magenta)', label: 'Live state' },
]

export default function SpectrumKey() {
  return (
    <div className="spectrum-key">
      <span className="spectrum-key__title mono">CHROMATIC KEY</span>
      <ul className="spectrum-key__list">
        {KEY.map((item) => (
          <li key={item.label}>
            <span className="spectrum-key__swatch" style={{ '--swatch': item.hue }} aria-hidden="true" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
