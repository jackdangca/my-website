
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


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

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    
    localStorage.setItem('portfolioContactMessage', JSON.stringify(formData))
    console.log('Contact form captured:', formData)

    setSubmitted(true)
    
    setTimeout(() => navigate('/'), 1500)
  }

  
  const inputClass =
    'w-full rounded-lg border border-slate-line bg-slate-soft px-3.5 py-2.5 text-sm text-slate-body focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/20'

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-ink md:text-4xl">Contact Me</h1>
      <p className="mb-10 max-w-2xl text-slate-muted">
        I would love to hear from you — send me a message below.
      </p>

      <div className="grid items-start gap-7 md:grid-cols-[340px_1fr]">
        {/* Contact information  */}
        <aside className="rounded-3xl bg-gradient-to-br from-slate-900 to-teal-900 p-7 text-white">
          <h2 className="mb-5 text-xl font-bold text-brand-light">Contact Information</h2>
          <ul className="space-y-4">
            <li className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-400">Email</span>
              <span className="text-slate-100">your.email@example.com</span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-400">Phone</span>
              <span className="text-slate-100">(000) 000-0000</span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-400">Location</span>
              <span className="text-slate-100">Toronto, ON, Canada</span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-400">Availability</span>
              <span className="text-slate-100">Open to co-op &amp; internship opportunities</span>
            </li>
          </ul>
        </aside>

        {/* Interactive contact form */}
        <section className="rounded-2xl border border-slate-line bg-white p-6 shadow-sm">
          {submitted ? (
            <div className="py-10 text-center">
              <h2 className="mb-2.5 text-2xl font-bold text-brand-dark">
                Thank you, {formData.firstName || 'friend'}!
              </h2>
              <p className="text-slate-muted">
                Your message has been captured. Redirecting you to the Home Page…
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="firstName" className="text-sm font-semibold text-ink">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="lastName" className="text-sm font-semibold text-ink">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="contactNumber" className="text-sm font-semibold text-ink">
                    Contact Number
                  </label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-ink">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="mb-4 flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-semibold text-ink">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-y`}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
              >
                Send Message
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  )
}
