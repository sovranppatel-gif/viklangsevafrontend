export const REPORTS_CMS_KEYS = ['home-reports', 'reports-hub', 'report-items']

export const DEFAULT_REPORTS = {
  'home-reports': {
    sectionLabel: 'Transparency & Reports',
    sectionLabelHi: 'पारदर्शिता और रिपोर्ट्स',
    title: 'Documents You Can Trust',
    titleHi: 'दस्तावेज़ जिन पर आप भरोसा कर सकते हैं',
    description:
      'We believe transparency builds trust. Verified documents can be uploaded and linked from the admin panel.',
    descriptionHi:
      'हम मानते हैं कि पारदर्शिता विश्वास बनाती है। सत्यापित दस्तावेज़ एडमिन पैनल से अपलोड और लिंक किए जा सकते हैं।',
    viewAllLabel: 'View All Reports →',
    viewAllLabelHi: 'सभी रिपोर्ट्स देखें →',
    viewAllLink: '/reports',
    viewPdfLabel: 'View PDF',
    viewPdfLabelHi: 'PDF देखें',
    downloadLabel: 'Download',
    downloadLabelHi: 'डाउनलोड',
    isActive: true,
  },

  'reports-hub': {
    heroLabel: 'Reports & Documents',
    heroLabelHi: 'रिपोर्ट्स और दस्तावेज़',
    heroTitle: 'Transparency Builds Trust',
    heroTitleHi: 'पारदर्शिता से विश्वास बनता है',
    heroDescription:
      'Certificates and reports can be uploaded and managed from the admin panel once verified.',
    heroDescriptionHi:
      'प्रमाणपत्र और रिपोर्ट्स सत्यापन के बाद एडमिन पैनल से अपलोड और प्रबंधित किए जा सकते हैं।',
    isActive: true,
  },

  'report-items': {
    items: [
      {
        id: 'annual',
        title: 'Annual Reports',
        titleHi: 'वार्षिक रिपोर्ट्स',
        description: 'Yearly overview of programs, outreach and organizational progress.',
        descriptionHi: 'कार्यक्रमों, आउटरीच और संगठनात्मक प्रगति का वार्षिक अवलोकन।',
        fileUrl: '',
        placeholder: true,
        isActive: true,
      },
      {
        id: 'financial',
        title: 'Financial Reports',
        titleHi: 'वित्तीय रिपोर्ट्स',
        description: 'Financial statements prepared for transparency and accountability.',
        descriptionHi: 'पारदर्शिता और जवाबदेही के लिए तैयार वित्तीय विवरण।',
        fileUrl: '',
        placeholder: true,
        isActive: true,
      },
      {
        id: '80g',
        title: '80G Certificate',
        titleHi: '80G प्रमाणपत्र',
        description: 'Tax exemption certificate details (upload verified document when available).',
        descriptionHi: 'कर छूट प्रमाणपत्र विवरण (उपलब्ध होने पर सत्यापित दस्तावेज़ अपलोड करें)।',
        fileUrl: '',
        placeholder: true,
        isActive: true,
      },
      {
        id: '12a',
        title: '12A Certificate',
        titleHi: '12A प्रमाणपत्र',
        description: 'Registration under 12A (placeholder until verified document is added).',
        descriptionHi: '12A के अंतर्गत पंजीकरण (सत्यापित दस्तावेज़ जुड़ने तक प्लेसहोल्डर)।',
        fileUrl: '',
        placeholder: true,
        isActive: true,
      },
      {
        id: 'registration',
        title: 'Registration Certificate',
        titleHi: 'पंजीकरण प्रमाणपत्र',
        description: 'Official registration document of the organization.',
        descriptionHi: 'संस्था का आधिकारिक पंजीकरण दस्तावेज़।',
        fileUrl: '',
        placeholder: true,
        isActive: true,
      },
    ],
  },
}
