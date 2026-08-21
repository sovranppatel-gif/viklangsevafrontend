import { RECEIPT_80G } from '../data/receipt80g'
import { toWhatsAppNumber } from './whatsappDonor'

export const VOLUNTEER_DEPARTMENTS = [
  'Education Support',
  'Rehabilitation',
  'Healthcare Support',
  'Skill Development',
  'Community Outreach',
  'Events',
  'Fundraising',
  'Administration',
]

export const VOLUNTEER_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'active', label: 'Active' },
  { value: 'declined', label: 'Declined' },
  { value: 'archived', label: 'Archived' },
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export const AVAILABILITY_OPTIONS = [
  'Weekdays',
  'Weekends',
  'Evenings',
  'Full-time',
  'As needed',
]

export function emptyVolunteerApplication() {
  return {
    name: '',
    fatherName: '',
    motherName: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    photoUrl: '',
    aadhaarNumber: '',
    aadhaarDocumentUrl: '',
    pan: '',
    panDocumentUrl: '',
    email: '',
    phone: '',
    whatsapp: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Narsinghpur',
    state: 'Madhya Pradesh',
    pincode: '',
    qualification: '',
    occupation: '',
    skills: '',
    interest: 'Education Support',
    availability: 'As needed',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    message: '',
  }
}

export function formatVolunteerDate(value) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value))
  } catch {
    return String(value)
  }
}

export function volunteerInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return 'V'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
}

export function formatVolunteerAddress(volunteer) {
  return [
    volunteer?.addressLine1,
    volunteer?.addressLine2,
    [volunteer?.city, volunteer?.state].filter(Boolean).join(', '),
    volunteer?.pincode,
  ]
    .filter(Boolean)
    .join(', ')
}

export function buildVolunteerWhatsAppMessage(volunteer) {
  return [
    `नमस्ते ${volunteer?.name || 'Volunteer'} जी,`,
    '',
    'विकलांग सेवा संस्थान, नरसिंहपुर में स्वयंसेवक के रूप में आपका स्वागत है।',
    volunteer?.volunteerCode ? `Volunteer ID: ${volunteer.volunteerCode}` : null,
    volunteer?.interest ? `विभाग: ${volunteer.interest}` : null,
    volunteer?.validUntil ? `कार्ड वैध तक: ${formatVolunteerDate(volunteer.validUntil)}` : null,
    '',
    'कृपया अपना ID कार्ड सुरक्षित रखें।',
    `संपर्क: ${RECEIPT_80G.address}`,
    'धन्यवाद!',
  ]
    .filter((line) => line !== null)
    .join('\n')
}

export function buildVolunteerWhatsAppUrl(volunteer) {
  const number = toWhatsAppNumber(volunteer?.whatsapp || volunteer?.phone)
  if (!number) return ''
  return `https://wa.me/${number}?text=${encodeURIComponent(buildVolunteerWhatsAppMessage(volunteer))}`
}
