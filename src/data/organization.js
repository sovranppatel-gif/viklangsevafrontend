export const organization = {
  name: 'Viklang Sewa Sansthan',
  shortName: 'VSS',
  tagline: 'Empowering Lives. Creating Possibilities.',
  taglineHi: 'जीवन को सशक्त बनाना। संभावनाएँ रचना।',
  runBy: 'Bramharshi Vashishth Shikshan Prashikshan Evam Sewa Samiti',
  location: 'Narsinghpur, Madhya Pradesh',
  phone: '9424645321',
  email: 'vss.about@gmail.com',
  whatsapp: '919424645321',
  address: {
    line1: 'Near Dr. Geeta Gupta Nursing Home',
    line2: 'Itwara Bazar Kandeli',
    city: 'Narsinghpur',
    state: 'Madhya Pradesh',
    pincode: '487001',
    country: 'India',
  },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    twitter: 'https://x.com',
  },
  mapEmbedUrl:
    'https://www.google.com/maps?q=Itwara+Bazar+Kandeli,+Narsinghpur,+Madhya+Pradesh+487001&output=embed',
  /** Replace with your organisation YouTube embed URL when ready */
  introVideoEmbed: 'https://www.youtube.com/embed/y8Wyv71RslY',
  description:
    'Viklang Sewa Sansthan works for persons with disabilities through education, rehabilitation, healthcare, skill development, community development and social inclusion in Narsinghpur, Madhya Pradesh.',
  trustPoints: [
    'Registered Organization',
    '80G / 12A Certified',
    'Transparency & Accountability',
  ],
  trustPointsHi: ['पंजीकृत संस्था', '80G / 12A प्रमाणित', 'पारदर्शिता और जवाबदेही'],
  mission:
    'To empower persons with disabilities through education, rehabilitation and skill-building so they can live with dignity, independence and equal opportunity.',
  vision:
    'An inclusive society where every person with disability is valued, supported and able to shape their own future.',
  payment: {
    upiId: '9424645321@upi',
    upiName: 'Viklang Sewa Sansthan',
    accountName: 'Viklang Sewa Sansthan',
    accountNumber: 'Update bank account',
    ifsc: 'Update IFSC',
    bankName: 'Contact us for bank transfer details',
    note: 'After UPI payment, share your name & amount on WhatsApp for 80G receipt. Fill the donation form to avail 80G tax benefit.',
    noteHi:
      'UPI भुगतान के बाद WhatsApp पर नाम और राशि भेजें। 80G की सेवा का लाभ पाने के लिए फॉर्म भरना न भूलें।',
  },
}

export const impactStats = [
  {
    id: 'lives',
    value: 500,
    suffix: '+',
    label: 'Lives Supported',
    labelHi: 'जीवन समर्थित',
    icon: 'HeartHandshake',
  },
  {
    id: 'children',
    value: 250,
    suffix: '+',
    label: 'Children Educated',
    labelHi: 'बच्चे शिक्षित',
    icon: 'GraduationCap',
  },
  {
    id: 'rehab',
    value: 100,
    suffix: '+',
    label: 'Rehabilitation Cases',
    labelHi: 'पुनर्वास मामले',
    icon: 'Activity',
  },
  {
    id: 'programs',
    value: 50,
    suffix: '+',
    label: 'Community Programs',
    labelHi: 'सामुदायिक कार्यक्रम',
    icon: 'Users',
  },
  {
    id: 'years',
    value: 20,
    suffix: '+',
    label: 'Years of Service',
    labelHi: 'सेवा के वर्ष',
    icon: 'Award',
  },
]

export const donationAmounts = [500, 1000, 2500, 5000]

/** Amount → concrete impact copy for conversion */
export const donationImpacts = {
  500: {
    en: '1 therapy / counselling session for a child',
    hi: 'एक बच्चे के लिए 1 थेरेपी / परामर्श सत्र',
  },
  1000: {
    en: 'Learning kit + school support for one week',
    hi: 'एक सप्ताह का लर्निंग किट + स्कूल सहयोग',
  },
  2500: {
    en: 'Assistive aid contribution for mobility / daily living',
    hi: 'गतिशीलता / दैनिक जीवन हेतु सहायक उपकरण योगदान',
  },
  5000: {
    en: 'One month rehabilitation support for a family',
    hi: 'एक परिवार के लिए एक माह का पुनर्वास सहयोग',
  },
}

export const donationCampaign = {
  title: 'Wheelchair & Assistive Aid Camp',
  titleHi: 'व्हीलचेयर और सहायक उपकरण शिविर',
  goal: 200000,
  raised: 124500,
  donorsToday: 12,
  totalDonors: 186,
  deadlineLabel: 'Ongoing appeal',
  deadlineLabelHi: 'चल रहा अभियान',
}

export function getDonationImpact(amount, lang = 'en') {
  const exact = donationImpacts[amount]
  if (exact) return exact[lang] || exact.en
  if (amount >= 5000) {
    return lang === 'hi'
      ? 'बड़े पैमाने पर पुनर्वास और शिक्षा सहयोग'
      : 'Significant rehabilitation & education support'
  }
  if (amount >= 2500) {
    return lang === 'hi' ? 'सहायक उपकरण / थेरेपी सहयोग' : 'Assistive aid / therapy support'
  }
  if (amount >= 1000) {
    return lang === 'hi' ? 'शिक्षा और देखभाल सहयोग' : 'Education & care support'
  }
  if (amount >= 1) {
    return lang === 'hi' ? 'किसी की ज़िंदगी में बदलाव की शुरुआत' : 'A meaningful start toward changing a life'
  }
  return ''
}

export function buildUpiPayUrl(amount) {
  const { upiId, upiName } = organization.payment
  const params = new URLSearchParams({
    pa: upiId,
    pn: upiName,
    cu: 'INR',
  })
  if (amount > 0) params.set('am', String(amount))
  params.set('tn', 'Donation to Viklang Sewa Sansthan')
  return `upi://pay?${params.toString()}`
}

export function buildUpiQrImageUrl(amount, size = 220) {
  const data = encodeURIComponent(buildUpiPayUrl(amount))
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`
}
