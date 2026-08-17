import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { organization as localOrganization } from '../data/organization'
import { mergeContactSettings } from '../data/contactSettingsDefaults'
import { mergeDonateSettings } from '../data/donateSettingsDefaults'
import { fetchContactSettings, fetchDonateSettings } from '../services/cms'

const OrganizationContext = createContext({
  organization: localOrganization,
  contact: mergeContactSettings(),
  donate: mergeDonateSettings(),
  loading: true,
})

export function OrganizationProvider({ children }) {
  const [contact, setContact] = useState(() => mergeContactSettings())
  const [donate, setDonate] = useState(() => mergeDonateSettings())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [contactData, donateData] = await Promise.all([
          fetchContactSettings(),
          fetchDonateSettings(),
        ])
        if (cancelled) return
        setContact(mergeContactSettings(contactData))
        setDonate(mergeDonateSettings(donateData))
      } catch {
        if (!cancelled) {
          setContact(mergeContactSettings())
          setDonate(mergeDonateSettings())
        }
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
      payment: {
        ...localOrganization.payment,
        upiId: donate.upiId,
        upiName: donate.upiName,
        qrImageUrl: donate.qrImageUrl,
        accountName: donate.accountName,
        accountNumber: donate.accountNumber,
        ifsc: donate.ifsc,
        bankName: donate.bankName,
        branch: donate.branch,
        note: donate.note,
        noteHi: donate.noteHi,
      },
    }

    return { organization: org, contact, donate, loading }
  }, [contact, donate, loading])

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}

export function useOrganization() {
  return useContext(OrganizationContext)
}
