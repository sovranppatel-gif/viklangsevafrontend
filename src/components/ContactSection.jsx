import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { useOrganization } from '../context/OrganizationContext'
import { submitContactForm } from '../services/api'

const initialForm = {
  name: '',
  email: '',
  mobile: '',
  message: '',
}

export default function ContactSection() {
  const { organization, contact } = useOrganization()
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', message: '' })
    try {
      const result = await submitContactForm(form)
      setStatus({ type: 'success', message: result.message })
      setForm(initialForm)
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.response?.data?.message ||
          'Unable to send your message right now. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-padding bg-white scroll-mt-28">
      <div className="container-page grid gap-10 lg:grid-cols-2">
        <div>
          <p className="section-label">{contact.contactLabel}</p>
          <h2 className="section-title">{contact.contactTitle}</h2>
          <p className="section-desc">{contact.contactDescription}</p>

          <div className="mt-8 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-navy">{organization.name}</h3>
              <p className="mt-2 flex gap-2 text-sm leading-relaxed text-text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  {organization.address.line1},
                  <br />
                  {organization.address.line2},
                  <br />
                  {organization.address.city}, {organization.address.state}{' '}
                  {organization.address.pincode}
                </span>
              </p>
            </div>
            <a
              href={`tel:${organization.phone}`}
              className="flex items-center gap-2 text-sm font-medium text-navy hover:text-brand"
            >
              <Phone className="h-4 w-4 text-brand" aria-hidden="true" />
              {organization.phone}
            </a>
            <a
              href={`mailto:${organization.email}`}
              className="flex items-center gap-2 text-sm font-medium text-navy hover:text-brand"
            >
              <Mail className="h-4 w-4 text-brand" aria-hidden="true" />
              {organization.email}
            </a>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-sm">
            <iframe
              title={`${organization.name} location on Google Maps`}
              src={organization.mapEmbedUrl}
              className="h-52 w-full border-0 sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-navy">Send a Message</h3>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-navy">
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                value={form.mobile}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
            {status.message ? (
              <p
                className={`text-sm ${status.type === 'success' ? 'text-accent-green' : 'text-brand'}`}
                role="status"
              >
                {status.message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  )
}
