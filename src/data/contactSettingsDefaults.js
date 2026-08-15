import { organization } from './organization'

export const DEFAULT_CONTACT_SETTINGS = {
  name: organization.name,
  tagline: organization.tagline,
  description: organization.description,
  location: organization.location,
  phone: organization.phone,
  email: organization.email,
  whatsapp: organization.whatsapp,
  address: { ...organization.address },
  social: { ...organization.social },
  mapEmbedUrl: organization.mapEmbedUrl,
  contactLabel: 'Contact',
  contactTitle: 'Get In Touch',
  contactDescription:
    'Reach out for program support, volunteering, partnerships or general enquiries.',
}

export function mergeContactSettings(data = {}) {
  return {
    ...DEFAULT_CONTACT_SETTINGS,
    ...data,
    address: {
      ...DEFAULT_CONTACT_SETTINGS.address,
      ...(data.address || {}),
    },
    social: {
      ...DEFAULT_CONTACT_SETTINGS.social,
      ...(data.social || {}),
    },
  }
}
