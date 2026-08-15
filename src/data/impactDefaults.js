export const IMPACT_CMS_KEYS = [
  'home-stories',
  'stories-hub',
  'story-items',
  'impact-stats',
  'impact-campaign',
]

export const STAT_ICON_OPTIONS = [
  'HeartHandshake',
  'GraduationCap',
  'Activity',
  'Users',
  'Award',
]

export const DEFAULT_IMPACT = {
  'home-stories': {
    sectionLabel: 'Impact Stories',
    sectionLabelHi: 'प्रभाव कहानियाँ',
    title: "Lives We've Touched",
    titleHi: 'जिन ज़िंदगियों को हमने छुआ',
    description:
      'Real journeys of courage, care and transformation — made possible through community support.',
    descriptionHi: 'साहस, देखभाल और बदलाव की असली कहानियाँ — समुदाय के सहयोग से संभव।',
    viewAllLabel: 'View All Stories →',
    viewAllLabelHi: 'सभी कहानियाँ देखें →',
    viewAllLink: '/impact/stories',
    isActive: true,
  },

  'stories-hub': {
    heroLabel: 'Success Stories',
    heroLabelHi: 'सफलता की कहानियाँ',
    heroTitle: 'Lives Transformed Through Care',
    heroTitleHi: 'देखभाल से बदली ज़िंदगियाँ',
    heroDescription:
      'Personal journeys that show the power of education, rehabilitation and community support.',
    heroDescriptionHi:
      'शिक्षा, पुनर्वास और सामुदायिक सहयोग की ताकत दिखाने वाली व्यक्तिगत यात्राएँ।',
    isActive: true,
  },

  'story-items': {
    items: [
      {
        id: '1',
        slug: 'from-challenges-to-confidence',
        title: 'From Challenges to Confidence',
        titleHi: 'चुनौतियों से आत्मविश्वास तक',
        excerpt:
          'With consistent rehabilitation support and community encouragement, a young learner rediscovered confidence and hope.',
        excerptHi:
          'निरंतर पुनर्वास सहयोग और समुदाय के प्रोत्साहन से एक युवा शिक्षार्थी ने आत्मविश्वास और आशा फिर से पाई।',
        content:
          'When support reached him at the right time, everything began to change. Through regular guidance, education support and a caring community, he moved from isolation to participation — and from doubt to confidence.',
        contentHi:
          'जब सही समय पर सहयोग मिला, सब कुछ बदलने लगा। नियमित मार्गदर्शन, शिक्षा सहयोग और एक देखभाल करने वाले समुदाय से वह अकेलेपन से भागीदारी की ओर बढ़ा — और संदेह से आत्मविश्वास की ओर।',
        image:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
        category: 'Rehabilitation',
        categoryHi: 'पुनर्वास',
        date: '2026-03-12',
        isActive: true,
      },
      {
        id: '2',
        slug: 'education-changed-everything',
        title: 'Education Changed Everything',
        titleHi: 'शिक्षा ने सब कुछ बदल दिया',
        excerpt:
          'School support and inclusive learning tools helped a child with disability return to classroom life with joy.',
        excerptHi:
          'स्कूल सहयोग और समावेशी शिक्षण सामग्री ने एक दिव्यांग बच्चे को खुशी के साथ कक्षा में लौटने में मदद की।',
        content:
          'Access to learning materials, patient mentoring and family counselling helped reshape her educational journey. Today she attends school with pride and dreams of a brighter future.',
        contentHi:
          'शिक्षण सामग्री, धैर्यपूर्ण मार्गदर्शन और परिवार परामर्श ने उनकी शैक्षिक यात्रा को नया आकार दिया। आज वह गर्व के साथ स्कूल जाती हैं और उज्जवल भविष्य का सपना देखती हैं।',
        image:
          'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80',
        category: 'Education',
        categoryHi: 'शिक्षा',
        date: '2026-02-20',
        isActive: true,
      },
      {
        id: '3',
        slug: 'a-new-beginning',
        title: 'A New Beginning',
        titleHi: 'एक नई शुरुआत',
        excerpt:
          'Skill training opened a pathway to livelihood and dignity for a young adult seeking independence.',
        excerptHi:
          'कौशल प्रशिक्षण ने स्वतंत्रता चाहने वाले एक युवा के लिए आजीविका और गरिमा का मार्ग खोला।',
        content:
          'Through vocational training and mentorship, he gained practical skills and renewed self-belief. What began as uncertainty became a new beginning built on capability and opportunity.',
        contentHi:
          'व्यावसायिक प्रशिक्षण और मार्गदर्शन से उन्होंने व्यावहारिक कौशल और नया आत्मविश्वास पाया। जो अनिश्चितता से शुरू हुआ, वह क्षमता और अवसर पर बनी एक नई शुरुआत बन गया।',
        image:
          'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=80',
        category: 'Skill Development',
        categoryHi: 'कौशल विकास',
        date: '2026-01-18',
        isActive: true,
      },
    ],
  },

  'impact-stats': {
    items: [
      {
        id: 'lives',
        value: 500,
        suffix: '+',
        label: 'Lives Supported',
        labelHi: 'जीवन समर्थित',
        icon: 'HeartHandshake',
        isActive: true,
      },
      {
        id: 'children',
        value: 250,
        suffix: '+',
        label: 'Children Educated',
        labelHi: 'बच्चे शिक्षित',
        icon: 'GraduationCap',
        isActive: true,
      },
      {
        id: 'rehab',
        value: 100,
        suffix: '+',
        label: 'Rehabilitation Cases',
        labelHi: 'पुनर्वास मामले',
        icon: 'Activity',
        isActive: true,
      },
      {
        id: 'programs',
        value: 50,
        suffix: '+',
        label: 'Community Programs',
        labelHi: 'सामुदायिक कार्यक्रम',
        icon: 'Users',
        isActive: true,
      },
      {
        id: 'years',
        value: 20,
        suffix: '+',
        label: 'Years of Service',
        labelHi: 'सेवा के वर्ष',
        icon: 'Award',
        isActive: true,
      },
    ],
  },

  'impact-campaign': {
    title: 'Wheelchair & Assistive Aid Camp',
    titleHi: 'व्हीलचेयर और सहायक उपकरण शिविर',
    description:
      'Help us reach families who need mobility aids and daily-living support in Narsinghpur.',
    descriptionHi:
      'नर्मदापुरम क्षेत्र के परिवारों तक गतिशीलता उपकरण और दैनिक सहयोग पहुँचाने में मदद करें।',
    quote: 'Every gift moves a family closer to dignity and independence.',
    quoteHi: 'हर दान एक परिवार को गरिमा और आत्मनिर्भरता के करीब लाता है।',
    goal: 200000,
    raised: 124500,
    donorsToday: 12,
    totalDonors: 186,
    deadlineLabel: 'Ongoing appeal',
    deadlineLabelHi: 'चल रहा अभियान',
    image:
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80',
    ctaLabel: 'Support this campaign',
    ctaLabelHi: 'इस अभियान का समर्थन करें',
    ctaLink: '/donate?amount=2500&method=upi',
    isActive: true,
  },
}
