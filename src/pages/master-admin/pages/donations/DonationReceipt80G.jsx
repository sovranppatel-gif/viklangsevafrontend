import { RECEIPT_80G } from '../../../../data/receipt80g'
import { amountInWordsINR, buildReceiptSerial, formatReceiptDate } from '../../../../utils/receipt'

/**
 * Printable 80G donation receipt — half A4 (A5 landscape) slip.
 */
export default function DonationReceipt80G({ donation, serial }) {
  if (!donation) return null

  const receiptNo = serial || buildReceiptSerial(donation)
  const dateLabel = formatReceiptDate(donation.donationDate || donation.createdAt)
  const words = amountInWordsINR(donation.amount)
  const amountFigure = Number(donation.amount || 0).toLocaleString('en-IN')
  const other =
    [donation.method, donation.frequency === 'monthly' ? 'Monthly' : null]
      .filter(Boolean)
      .join(' · ') || '—'

  return (
    <div className="donation-receipt-sheet">
      <div className="dr-inner">
        <div className="dr-meta">
          <span>PAN-{RECEIPT_80G.pan}</span>
          <span>पंजी.क्र. {RECEIPT_80G.registrationNo}</span>
        </div>

        <header className="dr-header">
          <img src={RECEIPT_80G.logoSrc} alt="" className="dr-logo" />
          <div className="dr-heading">
            <p className="dr-motto">{RECEIPT_80G.mottoHi}</p>
            <h1>{RECEIPT_80G.orgNameHi}</h1>
            <p className="dr-run">{RECEIPT_80G.operatedByHi}</p>
            <p className="dr-run">{RECEIPT_80G.recognitionHi}</p>
            <p className="dr-title">दान रसीद / 80G Receipt</p>
          </div>
        </header>

        <div className="dr-serial">
          <p>
            <strong>क्र.</strong> {receiptNo}
          </p>
          <p>
            <strong>दिनांक</strong> {dateLabel}
          </p>
        </div>

        <div className="dr-body">
          <p>
            <strong>नाम श्री/श्रीमति</strong> {donation.name || '………………'} <strong>द्वारा</strong>
          </p>
          <p>
            <strong>राशि शब्दों में</strong> {words} <strong>सधन्यवाद प्राप्त की।</strong>
          </p>
          <div className="dr-two">
            <p>
              <strong>दान राशि</strong> ₹ {amountFigure}
            </p>
            <p>
              <strong>अन्य</strong> {other}
            </p>
          </div>
          {(donation.email || donation.phone || donation.pan || donation.address) && (
            <p className="dr-contact">
              {[
                donation.phone ? `फ़ोन: ${donation.phone}` : '',
                donation.email ? `ईमेल: ${donation.email}` : '',
                donation.pan ? `Donor PAN: ${donation.pan}` : '',
                donation.address ? `पता: ${donation.address}` : '',
              ]
                .filter(Boolean)
                .join('  ·  ')}
            </p>
          )}
        </div>

        <div className="dr-boxes">
          <div className="dr-amount-box">
            <span>रु.</span>
            <strong>{amountFigure}</strong>
          </div>
          <div className="dr-80g">
            <p className="dr-80g-title">Donation Exempt {RECEIPT_80G.sectionShort}</p>
            <p>
              Approval No. <strong>{RECEIPT_80G.approvalNumber}</strong> · DIN{' '}
              <strong>{RECEIPT_80G.din}</strong>
            </p>
            <p>
              Dt. {RECEIPT_80G.approvalDate} · Valid AY {RECEIPT_80G.validFromAy} to{' '}
              {RECEIPT_80G.validToAy}
            </p>
            <p>
              {RECEIPT_80G.formName} · {RECEIPT_80G.donorCertificateForm} / Rule 18AB
            </p>
          </div>
        </div>

        <p className="dr-footer">
          {RECEIPT_80G.trustName} · PAN {RECEIPT_80G.pan} · {RECEIPT_80G.address}
        </p>

        <div className="dr-signs">
          <div>
            <span className="dr-sign-line" />
            हस्ताक्षर जमाकर्ता
          </div>
          <div>
            <span className="dr-sign-line" />
            हस्ताक्षर प्राप्तकर्ता
          </div>
        </div>
      </div>
    </div>
  )
}
