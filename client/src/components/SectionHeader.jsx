import Reveal from './Reveal.jsx'

export default function SectionHeader({ index, label, title, aside }) {
  return (
    <Reveal className="section-head" data-index={index}>
      <div>
        {index && <p className="section-head__index">{index} — {label}</p>}
        <h2 className="h2">{title}</h2>
      </div>
      {aside && <p className="section-head__aside">{aside}</p>}
    </Reveal>
  )
}
