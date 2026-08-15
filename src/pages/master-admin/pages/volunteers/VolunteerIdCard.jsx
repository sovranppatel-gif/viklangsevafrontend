import { RECEIPT_80G } from '../../../../data/receipt80g'
import {
  formatVolunteerAddress,
  formatVolunteerDate,
  volunteerInitials,
} from '../../../../utils/volunteer'

export default function VolunteerIdCard({ volunteer }) {
  if (!volunteer) return null

  const address = formatVolunteerAddress(volunteer) || RECEIPT_80G.address
  const validUntil = formatVolunteerDate(volunteer.validUntil)
  const photo = volunteer.photoUrl

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-center gap-5">
        <article className="volunteer-id-card relative h-[54mm] w-[86mm] overflow-hidden rounded-[12px] bg-[#0A1628] text-white shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-brand" />
          <div className="flex h-full flex-col px-3 pt-2.5 pb-2">
            <div className="flex items-center gap-2">
              <img src={RECEIPT_80G.logoSrc} alt="" className="h-8 w-8 rounded-full bg-white object-contain p-0.5" />
              <div className="min-w-0">
                <p className="text-[8px] font-semibold tracking-[0.14em] text-brand uppercase">
                  Volunteer Identity Card
                </p>
                <p className="truncate text-[11px] leading-tight font-bold">
                  {RECEIPT_80G.orgNameEn}
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-1 gap-2.5">
              <div className="flex h-[28mm] w-[22mm] shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/20 bg-white/10">
                {photo ? (
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white/80">{volunteerInitials(volunteer.name)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-[9px] leading-snug">
                <p className="text-[12px] leading-tight font-bold uppercase">{volunteer.name}</p>
                <p className="mt-1 font-semibold tracking-wide text-brand">
                  {volunteer.volunteerCode || 'ID PENDING'}
                </p>
                <p className="mt-1 text-white/80">{volunteer.interest || 'Volunteer'}</p>
                {volunteer.bloodGroup ? <p className="mt-0.5">Blood group: {volunteer.bloodGroup}</p> : null}
                <p className="mt-0.5">Valid till: {validUntil}</p>
              </div>
            </div>
          </div>
        </article>

        <article className="volunteer-id-card relative h-[54mm] w-[86mm] overflow-hidden rounded-[12px] border border-navy/20 bg-white text-navy shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-brand" />
          <div className="flex h-full flex-col px-3 pt-2.5 pb-2 text-[8px] leading-snug">
            <p className="text-[10px] font-bold">If found, please return to</p>
            <p className="mt-0.5 font-semibold">{RECEIPT_80G.orgNameEn}</p>
            <p className="text-text-muted">{RECEIPT_80G.address}</p>

            <div className="mt-1.5 space-y-0.5">
              <p>
                <span className="font-semibold">Address:</span> {address}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {volunteer.phone || '—'}
              </p>
              <p>
                <span className="font-semibold">Emergency:</span>{' '}
                {volunteer.emergencyName
                  ? `${volunteer.emergencyName} (${volunteer.emergencyPhone || '—'})`
                  : volunteer.emergencyPhone || '—'}
              </p>
            </div>

            <p className="mt-auto pt-1 text-[7px] leading-tight text-text-muted">
              This card remains the property of Viklang Sewa Sansthan. It is for identification of
              authorised volunteers only and must be shown during official activities.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
