import { RECEIPT_80G } from '../../../../data/receipt80g'
import { formatStudentDate } from '../../../../utils/student'
import { mediaUrl } from '../../../../utils/media'

function Cell({ label, value, span = 1 }) {
  return (
    <td colSpan={span} className="sas-cell">
      <span className="sas-label">{label}</span>
      <span className="sas-value">{value || '………………'}</span>
    </td>
  )
}

export default function StudentAdmissionPrint({ student }) {
  if (!student) return null

  const fullAddress = [student.address, student.city, student.state, student.pincode]
    .filter(Boolean)
    .join(', ')
  const dob = formatStudentDate(student.dateOfBirth)

  return (
    <div className="student-admission-sheet">
      <header className="sas-header">
        <img src={RECEIPT_80G.logoSrc} alt="" className="sas-logo" />
        <div className="sas-heading">
          <p className="sas-org-run">{RECEIPT_80G.operatedByHi}</p>
          <h1 className="sas-org-name">{RECEIPT_80G.orgNameHi}</h1>
          <p className="sas-target">(मूक बधिर एवं मानसिक मंद हेतु)</p>
          <p className="sas-title">प्रवेश हेतु आवेदन-पत्र</p>
        </div>
        {student.photoUrl ? (
          <img src={mediaUrl(student.photoUrl)} alt="" className="sas-photo" />
        ) : (
          <div className="sas-photo sas-photo-empty">फोटो</div>
        )}
      </header>

      <table className="sas-table">
        <tbody>
          <tr>
            <Cell label="1. पंजीयन क्रमांक" value={student.registrationNumber} />
            <Cell label="दिनांक" value={formatStudentDate(student.registrationDate)} />
          </tr>
          <tr>
            <Cell label="2. नाम" value={student.name} />
            <Cell label="विकलांगता" value={student.disabilityType} />
          </tr>
          <tr>
            <Cell label="3. आयु" value={student.age} />
            <Cell
              label="लिंग / जन्म तिथि"
              value={[student.gender, dob !== '—' ? dob : ''].filter(Boolean).join('  ·  ')}
            />
          </tr>
          <tr>
            <Cell label="4. पिता-अभिभावक" value={student.fatherGuardianName} span={2} />
          </tr>
          <tr>
            <Cell label="5. पता" value={fullAddress} span={2} />
          </tr>
          <tr>
            <Cell
              label="6. पिता — व्यवसाय / शिक्षा / उम्र"
              value={[student.fatherOccupation, student.fatherEducation, student.fatherAge].filter(Boolean).join('  ·  ')}
              span={2}
            />
          </tr>
          <tr>
            <Cell
              label="7. माता — व्यवसाय / शिक्षा / उम्र"
              value={[student.motherOccupation, student.motherEducation, student.motherAge].filter(Boolean).join('  ·  ')}
              span={2}
            />
          </tr>
          <tr>
            <Cell label="8. जाति" value={student.caste} />
            <Cell label="मातृ भाषा" value={student.motherTongue} />
          </tr>
          <tr>
            <Cell label="9. भाई-बहिन संख्या" value={student.siblingsCount} />
            <Cell label="10. परिवार में विकलांगता" value={student.familyDisabilityType} />
          </tr>
          <tr>
            <Cell label="11. रुचि" value={student.childInterests} />
            <Cell label="12. स्वभाव" value={student.childNature} />
          </tr>
          <tr>
            <td colSpan={2} className="sas-cell sas-cell-block">
              <span className="sas-label">13. परिवार का वातावरण</span>
              <span className="sas-value sas-block">{student.familyEnvironment || '………………'}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <section className="sas-declaration">
        <h2>घोषणा-पत्र</h2>
        <p>
          मैं <strong>{student.declarationName || student.fatherGuardianName || '………………'}</strong>{' '}
          {student.declarationRelation || 'आत्मज/आत्मजा'}{' '}
          <strong>{student.fatherGuardianName || '………………'}</strong> यह घोषणा करता हूँ कि मैं अपने बालक/बालिका के हित
          में विकलांग सेवा संस्थान के सभी नियमों का पालन करूंगा। एवं संस्था के कार्यालयीन समय में किसी तरह की आकस्मिक
          दुर्घटना, चोट लगने के लिए मैं संस्था को दोषी करार नहीं करूंगा।
        </p>
        <div className="sas-sign-row">
          <p>
            <span className="sas-label">दिनांक</span>{' '}
            {formatStudentDate(student.declarationDate || student.registrationDate)}
          </p>
          <p className="sas-sign">
            <span className="sas-sign-line">{student.guardianSignature || '\u00a0'}</span>
            हस्ताक्षर पिता/अभिभावक
          </p>
        </div>
      </section>
    </div>
  )
}
