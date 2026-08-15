import LegalPage from './LegalPage'

export default function PrivacyPolicy() {
  return (
    <LegalPage label="Legal" title="Privacy Policy">
      <p>
        Viklang Sewa Sansthan respects your privacy. Information shared through contact, volunteer
        or donation forms is used only to respond to enquiries and improve our services.
      </p>
      <p className="mt-4">
        We do not sell personal information. When a payment gateway or CMS is connected, this policy
        will be updated with verified data-handling practices.
      </p>
    </LegalPage>
  )
}
