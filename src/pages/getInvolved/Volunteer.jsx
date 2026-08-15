import { useState } from 'react'
import PageHero from '../../components/ui/PageHero'
import { submitVolunteerForm } from '../../services/api'

const initial = {
  name: '',
  email: '',
  phone: '',
  interest: 'Education Support',
  message: '',
}

export default function Volunteer() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    setSuccess(false)
    try {
      const result = await submitVolunteerForm(form)
      setStatus(result.message)
      setSuccess(true)
      setForm(initial)
    } catch (error) {
      setSuccess(false)
      setStatus(
        error?.response?.data?.message ||
          'Unable to submit right now. Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHero
        label="Volunteer"
        title="Become a Volunteer"
        description="Your skills, time and compassion can strengthen education, rehabilitation and community programs."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Get Involved', to: '/get-involved' },
          { label: 'Volunteer' },
        ]}
      />
      <section className="section-padding">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy">How You Can Help</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-muted">
              <li>• Support classroom learning and education activities</li>
              <li>• Assist in community awareness and outreach programs</li>
              <li>• Help organize events and distribution drives</li>
              <li>• Contribute professional skills in healthcare, training or media</li>
            </ul>
          </div>
          <form onSubmit={onSubmit} className="card space-y-4">
            <h3 className="text-xl font-bold text-navy">Volunteer Interest Form</h3>
            {['name', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="mb-1.5 block text-sm font-medium capitalize text-navy">
                  {field}
                </label>
                <input
                  id={field}
                  name={field}
                  required
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  value={form[field]}
                  onChange={onChange}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label htmlFor="interest" className="mb-1.5 block text-sm font-medium text-navy">
                Area of Interest
              </label>
              <select
                id="interest"
                name="interest"
                value={form.interest}
                onChange={onChange}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              >
                <option>Education Support</option>
                <option>Rehabilitation</option>
                <option>Events</option>
                <option>Community Outreach</option>
                <option>Healthcare Support</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={form.message}
                onChange={onChange}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Application'}
            </button>
            {status ? (
              <p className={`text-sm ${success ? 'text-accent-green' : 'text-red-600'}`} role="status">
                {status}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </>
  )
}
