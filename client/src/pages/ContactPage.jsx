import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import { profile } from '../data/portfolio.js'

const emptyForm = {
  firstName: '',
  lastName: '',
  contactNumber: '',
  email: '',
  message: '',
}

export default function ContactPage() {
  const [formData, setFormData] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      await api.post('/api/contacts', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.contactNumber.trim(),
        message: formData.message.trim(),
      })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="page-head">
        <div className="grid-bg" aria-hidden="true" />
        <div className="shell">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 'var(--s6)' }}>Contact / 05</p>
            <h1 className="h1">Let&apos;s talk about<br />the system.</h1>
            <p className="lead">
              A role, a platform redesign, an architecture review, or just a hard problem you want a
              second opinion on — send a short note and I will get back to you.
            </p>
            <div className="page-head__meta">
              <span><span className="status-dot" aria-hidden="true" /> Available for select projects</span>
              <span>{profile.location}</span>
              <span>Replies within 1–2 business days</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-body">
        <div className="shell split">
          <Reveal>
            <div className="contact-aside">
              <div>
                <h2 className="h3">Direct channels</h2>
                <p className="form-note" style={{ marginTop: 'var(--s2)' }}>
                  Prefer email? That is fine too — no form required.
                </p>
              </div>

              <dl>
                <div className="contact-channel">
                  <dt>Email</dt>
                  <dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd>
                </div>
                <div className="contact-channel">
                  <dt>Phone</dt>
                  <dd><a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a></dd>
                </div>
                <div className="contact-channel">
                  <dt>Location</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div className="contact-channel">
                  <dt>Availability</dt>
                  <dd>{profile.availability}</dd>
                </div>
              </dl>

              <div>
                <p className="eyebrow" style={{ marginBottom: 'var(--s4)' }}>Elsewhere</p>
                <div className="social-row" style={{ marginTop: 0 }}>
                  {profile.socials.map((social) => (
                    <a
                      key={social.label}
                      className="social-link"
                      href={social.href}
                      aria-label={social.label}
                      title={social.label}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      <Icon name={social.icon} size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="note-panel" style={{ marginTop: 'var(--s5)' }}>
              <h3>Looking for something else?</h3>
              <p>
                For the technical detail behind any project, the case studies are a better starting
                point than a blank message.
              </p>
              <Link to="/projects" className="text-link" style={{ marginTop: 'var(--s5)' }}>
                Browse case studies <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="panel" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              {submitted ? (
                <div className="success-state">
                  <span className="success-state__icon"><Icon name="check" size={24} /></span>
                  <h2>Thanks, {formData.firstName || 'friend'}.</h2>
                  <p>Your message has been saved. I will get back to you shortly.</p>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => { setFormData(emptyForm); setSubmitted(false) }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate={false}>
                  <h2 className="h3" style={{ marginBottom: 'var(--s2)' }}>Send a message</h2>
                  <p className="form-note" style={{ marginBottom: 'var(--s8)' }}>
                    Fields marked <span style={{ color: 'var(--accent)' }}>*</span> are required.
                  </p>

                  {submitError && (
                    <p className="notice notice--error" style={{ marginBottom: 'var(--s5)' }} role="alert">
                      <Icon name="close" size={16} /> {submitError}
                    </p>
                  )}

                  <div className="form-grid form-grid--2">
                    <div className="field">
                      <label htmlFor="firstName">First name <span className="req">*</span></label>
                      <input id="firstName" name="firstName" type="text" className="input"
                        value={formData.firstName} onChange={handleChange} maxLength="50"
                        autoComplete="given-name" required />
                    </div>
                    <div className="field">
                      <label htmlFor="lastName">Last name <span className="req">*</span></label>
                      <input id="lastName" name="lastName" type="text" className="input"
                        value={formData.lastName} onChange={handleChange} maxLength="50"
                        autoComplete="family-name" required />
                    </div>
                    <div className="field">
                      <label htmlFor="email">Email address <span className="req">*</span></label>
                      <input id="email" name="email" type="email" className="input"
                        value={formData.email} onChange={handleChange} maxLength="254"
                        autoComplete="email" required />
                    </div>
                    <div className="field">
                      <label htmlFor="contactNumber">Contact number</label>
                      <input id="contactNumber" name="contactNumber" type="tel" className="input"
                        value={formData.contactNumber} onChange={handleChange} maxLength="30"
                        autoComplete="tel" />
                    </div>
                  </div>

                  <div className="field" style={{ marginTop: 'var(--s5)' }}>
                    <label htmlFor="message">Message <span className="req">*</span></label>
                    <textarea id="message" name="message" rows="6" className="textarea"
                      value={formData.message} onChange={handleChange} maxLength="2000"
                      placeholder="A little about the system, the problem, and what a good outcome looks like…" required />
                  </div>

                  <button type="submit" className="btn btn--primary btn--block" disabled={submitting}
                    style={{ marginTop: 'var(--s6)' }}>
                    {submitting ? 'Sending…' : 'Send message'} <Icon name="arrow-right" size={16} />
                  </button>
                  <p className="form-note" style={{ marginTop: 'var(--s4)' }}>
                    Your message is stored via the portfolio API. I will only use it to reply to you.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
