import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { organization as localOrganization } from '../data/organization'
import { mergeContactSettings } from '../data/contactSettingsDefaults'
import { fetchContactSettings } from '../services/cms'

const OrganizationContext = createContext({
  organization: localOrganization,
  contact: mergeContactSettings(),
  loading: true,
})

export function OrganizationProvider({ children }) {
  const [contact, setContact] = useState(() => mergeContactSettings())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchContactSettings()
        if (!cancelled) setContact(mergeContactSettings(data))
      } catch {
        if (!cancelled) setContact(mergeContactSettings())
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => {
    const org = {
      ...localOrganization,
      name: contact.name || localOrganization.name,
      tagline: contact.tagline || localOrganization.tagline,
      description: contact.description || localOrganization.description,
      location: contact.location || localOrganization.location,
      phone: contact.phone || localOrganization.phone,
      email: contact.email || localOrganization.email,
      whatsapp: contact.whatsapp || localOrganization.whatsapp,
      address: {
        ...localOrganization.address,
        ...(contact.address || {}),
      },
      social: {
        ...localOrganization.social,
        ...(contact.social || {}),
      },
      mapEmbedUrl: contact.mapEmbedUrl || localOrganization.mapEmbedUrl,
    }

    return { organization: org, contact, loading }
  }, [contact, loading])

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}

export function useOrganization() {
  return useContext(OrganizationContext)
}
