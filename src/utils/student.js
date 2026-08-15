export const STUDENT_STATUSES = [
  { value: 'applied', label: 'Applied', labelHi: 'आवेदन' },
  { value: 'admitted', label: 'Admitted', labelHi: 'प्रवेशित' },
  { value: 'left', label: 'Left', labelHi: 'छोड़ चुके' },
  { value: 'archived', label: 'Archived', labelHi: 'संग्रहित' },
]

export const DISABILITY_TYPES = [
  'मूक (Mute)',
  'बधिर (Deaf)',
  'मानसिक मंद (Intellectual disability)',
  'मूक-बधिर',
  'बहु विकलांगता',
  'अन्य',
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export function formatStudentDate(value) {
  if (!value) return '—'
  try {
    const raw = String(value)
    const dayOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
    const date = dayOnly
      ? new Date(Number(dayOnly[1]), Number(dayOnly[2]) - 1, Number(dayOnly[3]))
      : new Date(value)
    if (Number.isNaN(date.getTime())) return raw
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date)
  } catch {
    return String(value)
  }
}

export function studentInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return 'S'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
}

export function ageFromDob(isoDate) {
  if (!isoDate) return ''
  const dob = new Date(isoDate)
  if (Number.isNaN(dob.getTime())) return ''
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const month = today.getMonth() - dob.getMonth()
  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) age -= 1
  return age >= 0 ? String(age) : ''
}

export function printStudentAdmission() {
  const existing = document.querySelector('style[data-student-print]')
  existing?.remove()

  const style = document.createElement('style')
  style.setAttribute('data-student-print', 'true')
  style.textContent = '@media print { @page { size: A4 portrait; margin: 10mm; } }'
  document.head.appendChild(style)
  document.body.classList.add('printing-student-admission')

  const cleanup = () => {
    style.remove()
    document.body.classList.remove('printing-student-admission')
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)
  window.print()
}
