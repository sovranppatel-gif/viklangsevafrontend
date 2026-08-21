export const PROGRAM_CMS_KEYS = [
  'home-programs',
  'programs-hub',
  'program-education',
  'program-rehabilitation',
  'program-skill-development',
  'program-healthcare',
  'program-community-development',
  'program-social-inclusion',
]

export const PROGRAM_ITEM_KEYS = [
  'program-education',
  'program-rehabilitation',
  'program-skill-development',
  'program-healthcare',
  'program-community-development',
  'program-social-inclusion',
]

export const DEFAULT_PROGRAMS = {
  'home-programs': {
    sectionLabel: 'Our Programs',
    sectionLabelHi: 'हमारे कार्यक्रम',
    title: 'What We Do',
    titleHi: 'हम क्या करते हैं',
    description:
      'We design practical programs that support persons with disabilities across education, health, livelihoods and community life.',
    descriptionHi:
      'हम शिक्षा, स्वास्थ्य, आजीविका और सामुदायिक जीवन में दिव्यांगजनों के समर्थन के लिए व्यावहारिक कार्यक्रम बनाते हैं।',
    readMoreLabel: 'Read More →',
    readMoreLabelHi: 'और पढ़ें →',
    isActive: true,
  },

  'programs-hub': {
    heroLabel: 'Programs',
    heroLabelHi: 'कार्यक्रम',
    heroTitle: 'Programs That Empower Lives',
    heroTitleHi: 'जीवन को सशक्त बनाने वाले कार्यक्रम',
    heroDescription:
      'Explore our work in education, rehabilitation, skill development, healthcare and community inclusion.',
    heroDescriptionHi:
      'शिक्षा, पुनर्वास, कौशल विकास, स्वास्थ्य और सामुदायिक समावेशन में हमारे कार्य को देखें।',
    isActive: true,
  },

  'program-education': {
    id: 'education',
    slug: 'education',
    order: 1,
    title: 'Education Support',
    titleHi: 'शिक्षा सहायता',
    shortDescription:
      'Inclusive learning support, school materials and guidance for children with disabilities.',
    shortDescriptionHi:
      'दिव्यांग बच्चों के लिए समावेशी शिक्षा सहायता, स्कूल सामग्री और मार्गदर्शन।',
    description:
      'We help children with disabilities access quality education through learning aids, tutoring support, school enrollment assistance and family counselling so every child can learn with confidence.',
    descriptionHi:
      'हम अधिगम सहायक सामग्री, ट्यूशन सहयोग, स्कूल नामांकन सहायता और पारिवारिक परामर्श से दिव्यांग बच्चों को गुणवत्तापूर्ण शिक्षा तक पहुँचाने में मदद करते हैं।',
    icon: 'BookOpen',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    aboutHeading: 'About This Program',
    aboutHeadingHi: 'इस कार्यक्रम के बारे में',
    primaryCtaLabel: 'Support This Program',
    primaryCtaLabelHi: 'इस कार्यक्रम का समर्थन करें',
    primaryCtaLink: '/donate',
    secondaryCtaLabel: 'Volunteer With Us',
    secondaryCtaLabelHi: 'हमारे साथ स्वयंसेवा करें',
    secondaryCtaLink: '/volunteer',
    showInNav: true,
    isActive: true,
  },

  'program-rehabilitation': {
    id: 'rehabilitation',
    slug: 'rehabilitation',
    order: 2,
    title: 'Rehabilitation',
    titleHi: 'पुनर्वास',
    shortDescription:
      'Therapeutic care and mobility support that helps individuals regain independence.',
    shortDescriptionHi: 'चिकित्सकीय देखभाल और गतिशीलता सहयोग जो स्वतंत्रता वापस दिलाने में मदद करता है।',
    description:
      'Our rehabilitation programs focus on physiotherapy guidance, assistive support and personalized recovery pathways that help persons with disabilities move toward greater self-reliance.',
    descriptionHi:
      'हमारे पुनर्वास कार्यक्रम फिजियोथेरेपी मार्गदर्शन, सहायक सहयोग और व्यक्तिगत रिकवरी मार्ग पर केंद्रित हैं।',
    icon: 'HeartPulse',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    aboutHeading: 'About This Program',
    aboutHeadingHi: 'इस कार्यक्रम के बारे में',
    primaryCtaLabel: 'Support This Program',
    primaryCtaLabelHi: 'इस कार्यक्रम का समर्थन करें',
    primaryCtaLink: '/donate',
    secondaryCtaLabel: 'Volunteer With Us',
    secondaryCtaLabelHi: 'हमारे साथ स्वयंसेवा करें',
    secondaryCtaLink: '/volunteer',
    showInNav: true,
    isActive: true,
  },

  'program-skill-development': {
    id: 'skill-development',
    slug: 'skill-development',
    order: 3,
    title: 'Skill Development',
    titleHi: 'कौशल विकास',
    shortDescription:
      'Practical training that builds employable skills and livelihood opportunities.',
    shortDescriptionHi: 'रोजगारपरक कौशल और आजीविका अवसर बनाने वाला व्यावहारिक प्रशिक्षण।',
    description:
      'Through vocational training and livelihood-oriented workshops, we equip youth and adults with disabilities with skills that open doors to employment, entrepreneurship and financial independence.',
    descriptionHi:
      'व्यावसायिक प्रशिक्षण और आजीविका कार्यशालाओं से हम दिव्यांग युवाओं और वयस्कों को रोजगार और उद्यमिता के कौशल देते हैं।',
    icon: 'Briefcase',
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    aboutHeading: 'About This Program',
    aboutHeadingHi: 'इस कार्यक्रम के बारे में',
    primaryCtaLabel: 'Support This Program',
    primaryCtaLabelHi: 'इस कार्यक्रम का समर्थन करें',
    primaryCtaLink: '/donate',
    secondaryCtaLabel: 'Volunteer With Us',
    secondaryCtaLabelHi: 'हमारे साथ स्वयंसेवा करें',
    secondaryCtaLink: '/volunteer',
    showInNav: true,
    isActive: true,
  },

  'program-healthcare': {
    id: 'healthcare',
    slug: 'healthcare',
    order: 4,
    title: 'Healthcare',
    titleHi: 'स्वास्थ्य सेवा',
    shortDescription:
      'Accessible health camps, counselling and referral support for better well-being.',
    shortDescriptionHi: 'बेहतर स्वास्थ्य के लिए सुलभ स्वास्थ्य शिविर, परामर्श और रेफरल सहयोग।',
    description:
      'We organize health awareness initiatives, medical referral support and wellness programs that make healthcare more accessible for persons with disabilities and their families.',
    descriptionHi:
      'हम स्वास्थ्य जागरूकता, चिकित्सा रेफरल और वेलनेस कार्यक्रम आयोजित करते हैं जो दिव्यांगजनों और परिवारों के लिए स्वास्थ्य सेवा सुलभ बनाते हैं।',
    icon: 'Stethoscope',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    aboutHeading: 'About This Program',
    aboutHeadingHi: 'इस कार्यक्रम के बारे में',
    primaryCtaLabel: 'Support This Program',
    primaryCtaLabelHi: 'इस कार्यक्रम का समर्थन करें',
    primaryCtaLink: '/donate',
    secondaryCtaLabel: 'Volunteer With Us',
    secondaryCtaLabelHi: 'हमारे साथ स्वयंसेवा करें',
    secondaryCtaLink: '/volunteer',
    showInNav: true,
    isActive: true,
  },

  'program-community-development': {
    id: 'community-development',
    slug: 'community-development',
    order: 5,
    title: 'Community Development',
    titleHi: 'सामुदायिक विकास',
    shortDescription:
      'Local outreach that strengthens families and builds inclusive neighborhoods.',
    shortDescriptionHi: 'परिवारों को मजबूत और समावेशी पड़ोस बनाने वाला स्थानीय आउटरीच।',
    description:
      'Our community programs create awareness, mobilize local support and help families become active partners in building more inclusive and caring communities.',
    descriptionHi:
      'हमारे सामुदायिक कार्यक्रम जागरूकता बढ़ाते हैं, स्थानीय सहयोग जुटाते हैं और परिवारों को समावेशी समुदाय बनाने में भागीदार बनाते हैं।',
    icon: 'Home',
    image:
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
    aboutHeading: 'About This Program',
    aboutHeadingHi: 'इस कार्यक्रम के बारे में',
    primaryCtaLabel: 'Support This Program',
    primaryCtaLabelHi: 'इस कार्यक्रम का समर्थन करें',
    primaryCtaLink: '/donate',
    secondaryCtaLabel: 'Volunteer With Us',
    secondaryCtaLabelHi: 'हमारे साथ स्वयंसेवा करें',
    secondaryCtaLink: '/volunteer',
    showInNav: true,
    isActive: true,
  },

  'program-social-inclusion': {
    id: 'social-inclusion',
    slug: 'social-inclusion',
    order: 6,
    title: 'Social Inclusion',
    titleHi: 'सामाजिक समावेशन',
    shortDescription:
      'Advocacy and programs that promote dignity, equality and belonging.',
    shortDescriptionHi: 'गरिमा, समानता और अपनत्व बढ़ाने वाले advocacy कार्यक्रम।',
    description:
      'We work to reduce stigma and create spaces where persons with disabilities participate fully in education, work, culture and everyday community life.',
    descriptionHi:
      'हम कलंक कम करने और ऐसे स्थान बनाने के लिए कार्य करते हैं जहाँ दिव्यांगजन शिक्षा, कार्य, संस्कृति और सामुदायिक जीवन में पूर्ण भागीदारी करें।',
    icon: 'Handshake',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    aboutHeading: 'About This Program',
    aboutHeadingHi: 'इस कार्यक्रम के बारे में',
    primaryCtaLabel: 'Support This Program',
    primaryCtaLabelHi: 'इस कार्यक्रम का समर्थन करें',
    primaryCtaLink: '/donate',
    secondaryCtaLabel: 'Volunteer With Us',
    secondaryCtaLabelHi: 'हमारे साथ स्वयंसेवा करें',
    secondaryCtaLink: '/volunteer',
    showInNav: true,
    isActive: true,
  },
}
