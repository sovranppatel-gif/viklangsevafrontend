export const ABOUT_KEYS = [
  'home-about',
  'about-hub',
  'about-story',
  'about-mission-vision',
  'about-team',
  'about-journey',
]

export const DEFAULT_ABOUT = {
  'home-about': {
    imageUrl:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Volunteers engaging with community members during an NGO activity',
    imageAltHi: 'एनजीओ गतिविधि के दौरान स्वयंसेवक समुदाय के सदस्यों के साथ',
    sectionLabel: 'About Us',
    sectionLabelHi: 'हमारे बारे में',
    title: 'Who We Are',
    titleHi: 'हम कौन हैं',
    body: 'Viklang Sewa Sansthan is a community-focused organization in Narsinghpur, Madhya Pradesh, dedicated to supporting persons with disabilities. Run by Bramharshi Vashishth Shikshan Prashikshan Evam Sewa Samiti, we work through education, rehabilitation, healthcare, skill development and social inclusion to create meaningful, lasting change.',
    bodyHi:
      'विकलांग सेवा संस्थान नरसिंहपुर, मध्य प्रदेश में दिव्यांगजनों के समर्थन के लिए समर्पित एक सामुदायिक संस्था है। ब्रह्मर्षि वशिष्ठ शिक्षण प्रशिक्षण एवं सेवा समिति द्वारा संचालित, हम शिक्षा, पुनर्वास, स्वास्थ्य, कौशल विकास और सामाजिक समावेशन के माध्यम से स्थायी बदलाव लाते हैं।',
    ctaLabel: 'Know More About Us →',
    ctaLabelHi: 'हमारे बारे में और जानें →',
    ctaLink: '/about',
    trustPoints: [
      { text: 'Registered Organization', textHi: 'पंजीकृत संस्था' },
      { text: '80G / 12A Certified', textHi: '80G / 12A प्रमाणित' },
      { text: 'Transparency & Accountability', textHi: 'पारदर्शिता और जवाबदेही' },
    ],
    missionTitle: 'Our Mission',
    missionTitleHi: 'हमारा मिशन',
    missionBody:
      'To empower persons with disabilities through education, rehabilitation and skill-building so they can live with dignity, independence and equal opportunity.',
    missionBodyHi:
      'शिक्षा, पुनर्वास और कौशल विकास के माध्यम से दिव्यांगजनों को सशक्त बनाना, ताकि वे गरिमा, स्वतंत्रता और समान अवसर के साथ जीवन जी सकें।',
    visionTitle: 'Our Vision',
    visionTitleHi: 'हमारा विज़न',
    visionBody:
      'An inclusive society where every person with disability is valued, supported and able to shape their own future.',
    visionBodyHi:
      'एक समावेशी समाज जहाँ प्रत्येक दिव्यांगजन मूल्यवान, समर्थित हो और अपना भविष्य स्वयं गढ़ सके।',
    introVideoEmbed: 'https://www.youtube.com/embed/y8Wyv71RslY',
    isActive: true,
  },

  'about-hub': {
    heroLabel: 'About',
    heroLabelHi: 'हमारे बारे में',
    heroTitle: 'About Viklang Sewa Sansthan',
    heroTitleHi: 'विकलांग सेवा संस्थान के बारे में',
    heroDescription:
      'Viklang Sewa Sansthan works for persons with disabilities through education, rehabilitation, healthcare, skill development, community development and social inclusion in Narsinghpur, Madhya Pradesh.',
    heroDescriptionHi:
      'विकलांग सेवा संस्थान नरसिंहपुर, मध्य प्रदेश में शिक्षा, पुनर्वास, स्वास्थ्य, कौशल विकास, सामुदायिक विकास और सामाजिक समावेशन के माध्यम से दिव्यांगजनों के लिए कार्य करता है।',
    cards: [
      {
        title: 'Our Story',
        titleHi: 'हमारी कहानी',
        description: 'How Viklang Sewa Sansthan began and why we serve.',
        descriptionHi: 'विकलांग सेवा संस्थान की शुरुआत और सेवा का उद्देश्य।',
        to: '/about/our-story',
      },
      {
        title: 'Mission & Vision',
        titleHi: 'मिशन और विज़न',
        description: 'The purpose and future we are working toward.',
        descriptionHi: 'हमारा उद्देश्य और जिस भविष्य की ओर हम बढ़ रहे हैं।',
        to: '/about/mission-vision',
      },
      {
        title: 'Our Team',
        titleHi: 'हमारी टीम',
        description: 'People and partners driving our programs forward.',
        descriptionHi: 'हमारे कार्यक्रमों को आगे बढ़ाने वाले लोग और सहयोगी।',
        to: '/about/team',
      },
      {
        title: 'Our Journey',
        titleHi: 'हमारी यात्रा',
        description: 'Key milestones in our path of service.',
        descriptionHi: 'सेवा के मार्ग के प्रमुख पड़ाव।',
        to: '/about/journey',
      },
    ],
    exploreLabel: 'Explore →',
    exploreLabelHi: 'देखें →',
    isActive: true,
  },

  'about-story': {
    heroLabel: 'Our Story',
    heroLabelHi: 'हमारी कहानी',
    heroTitle: 'A Journey of Care and Inclusion',
    heroTitleHi: 'देखभाल और समावेशन की यात्रा',
    heroDescription:
      'Serving persons with disabilities with dignity, compassion and practical support.',
    heroDescriptionHi: 'गरिमा, करुणा और व्यावहारिक सहयोग के साथ दिव्यांगजनों की सेवा।',
    paragraphs: [
      {
        body: 'Viklang Sewa Sansthan was built on a simple belief: every person deserves opportunity, respect and a chance to grow. Based in Narsinghpur, Madhya Pradesh, our organization supports persons with disabilities through education, rehabilitation, healthcare and community-centered programs.',
        bodyHi:
          'विकलांग सेवा संस्थान एक सरल विश्वास पर बना: प्रत्येक व्यक्ति अवसर, सम्मान और आगे बढ़ने का मौका पाने का हकदार है। नरसिंहपुर, मध्य प्रदेश में स्थित हमारी संस्था शिक्षा, पुनर्वास, स्वास्थ्य और सामुदायिक कार्यक्रमों से दिव्यांगजनों का समर्थन करती है।',
      },
      {
        body: 'Run by Bramharshi Vashishth Shikshan Prashikshan Evam Sewa Samiti, we work closely with families, volunteers and local partners to create pathways toward independence and social inclusion.',
        bodyHi:
          'ब्रह्मर्षि वशिष्ठ शिक्षण प्रशिक्षण एवं सेवा समिति द्वारा संचालित, हम परिवारों, स्वयंसेवकों और स्थानीय सहयोगियों के साथ मिलकर स्वतंत्रता और सामाजिक समावेशन के मार्ग बनाते हैं।',
      },
      {
        body: 'From classroom support to rehabilitation guidance and community awareness, our story continues through every life we walk alongside — one step, one family and one possibility at a time.',
        bodyHi:
          'कक्षा सहयोग से पुनर्वास मार्गदर्शन और सामुदायिक जागरूकता तक — हमारी कहानी हर उस जीवन के साथ आगे बढ़ती है जिसके साथ हम चलते हैं।',
      },
    ],
    isActive: true,
  },

  'about-mission-vision': {
    heroLabel: 'Mission & Vision',
    heroLabelHi: 'मिशन और विज़न',
    heroTitle: 'What Guides Our Work',
    heroTitleHi: 'हमारे कार्य का मार्गदर्शन',
    heroDescription: 'Clear purpose. Inclusive future. Measurable care.',
    heroDescriptionHi: 'स्पष्ट उद्देश्य। समावेशी भविष्य। मापने योग्य देखभाल।',
    missionTitle: 'Our Mission',
    missionTitleHi: 'हमारा मिशन',
    missionBody:
      'To empower persons with disabilities through education, rehabilitation and skill-building so they can live with dignity, independence and equal opportunity.',
    missionBodyHi:
      'शिक्षा, पुनर्वास और कौशल विकास के माध्यम से दिव्यांगजनों को सशक्त बनाना, ताकि वे गरिमा, स्वतंत्रता और समान अवसर के साथ जीवन जी सकें।',
    visionTitle: 'Our Vision',
    visionTitleHi: 'हमारा विज़न',
    visionBody:
      'An inclusive society where every person with disability is valued, supported and able to shape their own future.',
    visionBodyHi:
      'एक समावेशी समाज जहाँ प्रत्येक दिव्यांगजन मूल्यवान, समर्थित हो और अपना भविष्य स्वयं गढ़ सके।',
    isActive: true,
  },

  'about-team': {
    heroLabel: 'Our Team',
    heroLabelHi: 'हमारी टीम',
    heroTitle: 'People Behind the Mission',
    heroTitleHi: 'मिशन के पीछे के लोग',
    heroDescription:
      'Dedicated individuals and volunteer networks working for inclusive development.',
    heroDescriptionHi: 'समावेशी विकास के लिए समर्पित व्यक्ति और स्वयंसेवक नेटवर्क।',
    members: [
      {
        id: '1',
        name: 'Leadership Team',
        nameHi: 'नेतृत्व टीम',
        role: 'Governing Body',
        roleHi: 'शासी निकाय',
        bio: 'Guided by a commitment to service, dignity and inclusive development for persons with disabilities.',
        bioHi: 'दिव्यांगजनों के लिए सेवा, गरिमा और समावेशी विकास की प्रतिबद्धता से मार्गदर्शित।',
        image:
          'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '2',
        name: 'Program Coordinators',
        nameHi: 'कार्यक्रम समन्वयक',
        role: 'Field Operations',
        roleHi: 'क्षेत्रीय संचालन',
        bio: 'Our coordinators ensure education, rehabilitation and community programs reach families with care.',
        bioHi: 'हमारे समन्वयक सुनिश्चित करते हैं कि शिक्षा, पुनर्वास और सामुदायिक कार्यक्रम परिवारों तक पहुँचें।',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '3',
        name: 'Volunteer Network',
        nameHi: 'स्वयंसेवक नेटवर्क',
        role: 'Community Support',
        roleHi: 'सामुदायिक सहयोग',
        bio: 'Volunteers strengthen every initiative — from classroom support to awareness campaigns.',
        bioHi: 'स्वयंसेवक हर पहल को मजबूत बनाते हैं — कक्षा सहयोग से जागरूकता अभियान तक।',
        image:
          'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
      },
    ],
    isActive: true,
  },

  'about-journey': {
    heroLabel: 'Our Journey',
    heroLabelHi: 'हमारी यात्रा',
    heroTitle: 'Milestones of Service',
    heroTitleHi: 'सेवा के पड़ाव',
    heroDescription:
      'A continuing path of education, rehabilitation and community empowerment.',
    heroDescriptionHi: 'शिक्षा, पुनर्वास और सामुदायिक सशक्तिकरण का निरंतर मार्ग।',
    milestones: [
      {
        id: '1',
        year: 'Foundation',
        yearHi: 'स्थापना',
        title: 'A Beginning Rooted in Service',
        titleHi: 'सेवा में निहित शुरुआत',
        description:
          'Viklang Sewa Sansthan began with a clear purpose: to support persons with disabilities with dignity and care.',
        descriptionHi:
          'विकलांग सेवा संस्थान एक स्पष्ट उद्देश्य के साथ शुरू हुआ: गरिमा और देखभाल के साथ दिव्यांगजनों का समर्थन करना।',
      },
      {
        id: '2',
        year: 'Growth',
        yearHi: 'विकास',
        title: 'Expanding Education & Rehabilitation',
        titleHi: 'शिक्षा और पुनर्वास का विस्तार',
        description:
          'Programs expanded into education support, rehabilitation and community outreach across Narsinghpur.',
        descriptionHi:
          'कार्यक्रम नरसिंहपुर में शिक्षा सहयोग, पुनर्वास और सामुदायिक पहुँच तक विस्तारित हुए।',
      },
      {
        id: '3',
        year: 'Today',
        yearHi: 'आज',
        title: 'Building an Inclusive Future',
        titleHi: 'समावेशी भविष्य का निर्माण',
        description:
          'We continue working for empowerment, healthcare access, skill development and social inclusion.',
        descriptionHi:
          'हम सशक्तिकरण, स्वास्थ्य पहुँच, कौशल विकास और सामाजिक समावेशन के लिए कार्य जारी रखते हैं।',
      },
    ],
    isActive: true,
  },
}
