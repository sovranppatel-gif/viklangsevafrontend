export const GALLERY_CMS_KEYS = [
  'home-gallery',
  'gallery-hub',
  'gallery-photos',
  'gallery-videos',
  'gallery-photo-items',
  'gallery-video-items',
]

export const DEFAULT_GALLERY = {
  'home-gallery': {
    sectionLabel: 'Our Gallery',
    sectionLabelHi: 'हमारी गैलरी',
    title: 'Moments of Change',
    titleHi: 'बदलाव के पल',
    description:
      'Glimpses of education support, healthcare outreach, volunteer work and community programs.',
    descriptionHi:
      'शिक्षा सहयोग, स्वास्थ्य आउटरीच, स्वयंसेवा और सामुदायिक कार्यक्रमों की झलकियाँ।',
    viewAllLabel: 'View All Photos →',
    viewAllLabelHi: 'सभी फ़ोटो देखें →',
    viewAllLink: '/gallery',
    previewLimit: 6,
    isActive: true,
  },

  'gallery-hub': {
    heroLabel: 'Gallery',
    heroLabelHi: 'गैलरी',
    heroTitle: 'Moments From Our Mission',
    heroTitleHi: 'हमारे मिशन के पल',
    heroDescription:
      'Browse photos and videos from education, healthcare, volunteer and community programs.',
    heroDescriptionHi:
      'शिक्षा, स्वास्थ्य, स्वयंसेवा और सामुदायिक कार्यक्रमों की फ़ोटो और वीडियो देखें।',
    cards: [
      {
        title: 'Photos',
        titleHi: 'फ़ोटो',
        description: 'Explore activity and program photography.',
        descriptionHi: 'गतिविधि और कार्यक्रम की फ़ोटोग्राफी देखें।',
        to: '/gallery/photos',
      },
      {
        title: 'Videos',
        titleHi: 'वीडियो',
        description: 'Watch stories and highlights from the field.',
        descriptionHi: 'मैदान से कहानियाँ और हाइलाइट्स देखें।',
        to: '/gallery/videos',
      },
    ],
    isActive: true,
  },

  'gallery-photos': {
    heroLabel: 'Photos',
    heroLabelHi: 'फ़ोटो',
    heroTitle: 'Photo Gallery',
    heroTitleHi: 'फ़ोटो गैलरी',
    heroDescription: 'A visual record of our service, celebrations and community programs.',
    heroDescriptionHi: 'हमारी सेवा, उत्सव और सामुदायिक कार्यक्रमों का दृश्य रिकॉर्ड।',
    isActive: true,
  },

  'gallery-videos': {
    heroLabel: 'Videos',
    heroLabelHi: 'वीडियो',
    heroTitle: 'Video Gallery',
    heroTitleHi: 'वीडियो गैलरी',
    heroDescription: 'Video stories and program highlights from Viklang Sewa Sansthan.',
    heroDescriptionHi: 'विकलांग सेवा संस्थान की वीडियो कहानियाँ और कार्यक्रम हाइलाइट्स।',
    isActive: true,
  },

  'gallery-photo-items': {
    items: [
      {
        id: '1',
        title: 'Children Learning Together',
        titleHi: 'बच्चे साथ सीखते हुए',
        category: 'Education',
        categoryHi: 'शिक्षा',
        type: 'photo',
        image:
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
        isActive: true,
      },
      {
        id: '2',
        title: 'Disability Support Session',
        titleHi: 'दिव्यांग सहायता सत्र',
        category: 'Support',
        categoryHi: 'सहायता',
        type: 'photo',
        image:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
        isActive: true,
      },
      {
        id: '3',
        title: 'Volunteers in Action',
        titleHi: 'कार्यरत स्वयंसेवक',
        category: 'Volunteers',
        categoryHi: 'स्वयंसेवक',
        type: 'photo',
        image:
          'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=80',
        isActive: true,
      },
      {
        id: '4',
        title: 'Distribution Program',
        titleHi: 'वितरण कार्यक्रम',
        category: 'Community',
        categoryHi: 'समुदाय',
        type: 'photo',
        image:
          'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
        isActive: true,
      },
      {
        id: '5',
        title: 'Healthcare Outreach',
        titleHi: 'स्वास्थ्य आउटरीच',
        category: 'Healthcare',
        categoryHi: 'स्वास्थ्य',
        type: 'photo',
        image:
          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
        isActive: true,
      },
      {
        id: '6',
        title: 'Community Celebration',
        titleHi: 'सामुदायिक उत्सव',
        category: 'Events',
        categoryHi: 'कार्यक्रम',
        type: 'photo',
        image:
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
        isActive: true,
      },
    ],
  },

  'gallery-video-items': {
    items: [
      {
        id: 'v1',
        title: 'Our Journey of Service',
        titleHi: 'हमारी सेवा यात्रा',
        category: 'Organization',
        categoryHi: 'संस्था',
        type: 'video',
        thumbnail:
          'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80',
        videoUrl: 'https://www.youtube.com/embed/y8Wyv71RslY',
        isActive: true,
      },
    ],
  },
}
