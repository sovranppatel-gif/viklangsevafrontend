export const BLOG_CMS_KEYS = [
  'home-blog',
  'home-events',
  'news-hub',
  'news-blog',
  'news-news',
  'news-events',
  'blog-articles',
  'event-items',
]

export const DEFAULT_BLOG = {
  'home-blog': {
    sectionLabel: 'From Our Organization',
    sectionLabelHi: 'हमारी संस्था से',
    title: 'Latest News & Stories',
    titleHi: 'ताज़ा समाचार और कहानियाँ',
    description: 'Updates, insights and stories from our programs and community work.',
    descriptionHi: 'हमारे कार्यक्रमों और सामुदायिक कार्य से अपडेट, जानकारियाँ और कहानियाँ।',
    viewAllLabel: 'View All Articles →',
    viewAllLabelHi: 'सभी लेख देखें →',
    viewAllLink: '/news/blog',
    readMoreLabel: 'Read More →',
    readMoreLabelHi: 'और पढ़ें →',
    isActive: true,
  },

  'home-events': {
    sectionLabel: 'Upcoming Events',
    sectionLabelHi: 'आगामी कार्यक्रम',
    title: 'Join Our Upcoming Events',
    titleHi: 'हमारे आगामी कार्यक्रमों में शामिल हों',
    description:
      'Be part of celebrations, outreach programs and community initiatives that strengthen inclusion.',
    descriptionHi:
      'समावेशन को मजबूत करने वाले उत्सव, आउटरीच और सामुदायिक पहलों का हिस्सा बनें।',
    viewAllLabel: 'View All Events →',
    viewAllLabelHi: 'सभी कार्यक्रम देखें →',
    viewAllLink: '/news/events',
    detailsLabel: 'View Details',
    detailsLabelHi: 'विवरण देखें',
    isActive: true,
  },

  'news-hub': {
    heroLabel: 'News & Events',
    heroLabelHi: 'समाचार और कार्यक्रम',
    heroTitle: 'Stay Connected With Our Work',
    heroTitleHi: 'हमारे कार्य से जुड़े रहें',
    heroDescription: 'Read updates, explore stories and join upcoming community programs.',
    heroDescriptionHi: 'अपडेट पढ़ें, कहानियाँ देखें और आगामी सामुदायिक कार्यक्रमों में शामिल हों।',
    openLabel: 'Open →',
    openLabelHi: 'खोलें →',
    cards: [
      { title: 'Blog', titleHi: 'ब्लॉग', to: '/news/blog' },
      { title: 'News', titleHi: 'समाचार', to: '/news/news' },
      { title: 'Events', titleHi: 'कार्यक्रम', to: '/news/events' },
    ],
    isActive: true,
  },

  'news-blog': {
    heroLabel: 'Blog',
    heroLabelHi: 'ब्लॉग',
    heroTitle: 'Latest Articles & Insights',
    heroTitleHi: 'नवीनतम लेख और जानकारियाँ',
    heroDescription: 'Stories and updates from Viklang Sewa Sansthan.',
    heroDescriptionHi: 'विकलांग सेवा संस्थान की कहानियाँ और अपडेट।',
    isActive: true,
  },

  'news-news': {
    heroLabel: 'News',
    heroLabelHi: 'समाचार',
    heroTitle: 'Organization News',
    heroTitleHi: 'संस्था समाचार',
    heroDescription: 'Announcements and updates from Viklang Sewa Sansthan.',
    heroDescriptionHi: 'विकलांग सेवा संस्थान की घोषणाएँ और अपडेट।',
    isActive: true,
  },

  'news-events': {
    heroLabel: 'Events',
    heroLabelHi: 'कार्यक्रम',
    heroTitle: 'Community Events & Programs',
    heroTitleHi: 'सामुदायिक कार्यक्रम एवं आयोजन',
    heroDescription:
      'Explore upcoming gatherings and look back at recently held programs across Narsinghpur.',
    heroDescriptionHi:
      'आगामी आयोजन देखें और नरसिंहपुर में हाल ही में हुए कार्यक्रमों की झलक पाएँ।',
    isActive: true,
  },

  'blog-articles': {
    items: [
      {
        id: '1',
        slug: 'building-inclusive-classrooms',
        title: 'Building Inclusive Classrooms in Rural Madhya Pradesh',
        titleHi: 'ग्रामीण मध्य प्रदेश में समावेशी कक्षाओं का निर्माण',
        excerpt:
          'How community partnership and patient teaching methods are helping children with disabilities stay in school.',
        excerptHi:
          'सामुदायिक साझेदारी और धैर्यपूर्ण शिक्षण विधियाँ दिव्यांग बच्चों को स्कूल में बनाए रखने में कैसे मदद कर रही हैं।',
        content:
          'Inclusive education begins with belief — belief that every child can learn. Across our education support initiatives, teachers, parents and volunteers work together to create classrooms where children with disabilities feel welcomed and supported.',
        contentHi:
          'समावेशी शिक्षा विश्वास से शुरू होती है — कि प्रत्येक बच्चा सीख सकता है। हमारे शिक्षा सहयोग प्रयासों में शिक्षक, माता-पिता और स्वयंसेवक मिलकर ऐसी कक्षाएँ बनाते हैं जहाँ दिव्यांग बच्चे स्वागत और समर्थन महसूस करें।',
        image:
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
        category: 'Education',
        categoryHi: 'शिक्षा',
        date: '2026-07-18',
        isActive: true,
      },
      {
        id: '2',
        slug: 'why-early-rehabilitation-matters',
        title: 'Why Early Rehabilitation Matters',
        titleHi: 'प्रारंभिक पुनर्वास क्यों ज़रूरी है',
        excerpt:
          'Timely support can transform recovery journeys and restore dignity for persons with disabilities.',
        excerptHi:
          'समय पर सहयोग पुनर्वास यात्रा को बदल सकता है और दिव्यांगजनों की गरिमा बहाल कर सकता है।',
        content:
          'Early intervention creates stronger outcomes. When rehabilitation begins with care, consistency and family involvement, individuals gain mobility, confidence and a clearer path toward independence.',
        contentHi:
          'प्रारंभिक हस्तक्षेप बेहतर परिणाम देता है। जब पुनर्वास देखभाल, निरंतरता और पारिवारिक भागीदारी से शुरू होता है, तो व्यक्ति गतिशीलता, आत्मविश्वास और स्वतंत्रता का स्पष्ट मार्ग पाते हैं।',
        image:
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
        category: 'Healthcare',
        categoryHi: 'स्वास्थ्य',
        date: '2026-06-30',
        isActive: true,
      },
      {
        id: '3',
        slug: 'community-that-cares',
        title: 'A Community That Cares Creates Lasting Change',
        titleHi: 'देखभाल करने वाला समुदाय स्थायी बदलाव लाता है',
        excerpt:
          'Local volunteers and neighbors are becoming powerful partners in social inclusion.',
        excerptHi: 'स्थानीय स्वयंसेवक और पड़ोसी सामाजिक समावेशन में शक्तिशाली भागीदार बन रहे हैं।',
        content:
          'Change becomes sustainable when communities take ownership. Through awareness programs and local participation, we are building a culture of empathy, accessibility and shared responsibility in Narsinghpur.',
        contentHi:
          'जब समुदाय स्वामित्व लेते हैं तो बदलाव स्थायी होता है। जागरूकता कार्यक्रमों और स्थानीय भागीदारी से हम नरसिंहपुर में सहानुभूति, पहुँच और साझा जिम्मेदारी की संस्कृति बना रहे हैं।',
        image:
          'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
        category: 'Community',
        categoryHi: 'समुदाय',
        date: '2026-05-22',
        isActive: true,
      },
    ],
  },

  'event-items': {
    items: [
      {
        id: '4',
        slug: 'assistive-device-camp',
        title: 'Assistive Device Distribution Camp',
        titleHi: 'सहायक उपकरण वितरण शिविर',
        date: '2026-07-20',
        time: '10:00 AM – 3:00 PM',
        location: 'Kandeli Community Hall',
        locationHi: 'कंदेली सामुदायिक भवन',
        description:
          'Wheelchairs, crutches and hearing-support devices were distributed with assessment support from local partners.',
        descriptionHi:
          'स्थानीय भागीदारों के सहयोग से व्हीलचेयर, बैसाखी और श्रवण सहायता उपकरणों का वितरण किया गया।',
        image:
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        ctaLabel: 'Join as Volunteer',
        ctaLabelHi: 'स्वयंसेवक बनें',
        ctaLink: '/volunteer',
        isActive: true,
      },
      {
        id: '5',
        slug: 'inclusive-education-workshop',
        title: 'Inclusive Education Awareness Workshop',
        titleHi: 'समावेशी शिक्षा जागरूकता कार्यशाला',
        date: '2026-06-12',
        time: '11:00 AM – 2:00 PM',
        location: 'Education Centre, Narsinghpur',
        locationHi: 'शिक्षा केंद्र, नरसिंहपुर',
        description:
          'Teachers and parents learned practical ways to support children with disabilities in local schools.',
        descriptionHi:
          'शिक्षकों और अभिभावकों ने स्थानीय स्कूलों में दिव्यांग बच्चों के सहयोग के व्यावहारिक तरीके सीखे।',
        image:
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
        ctaLabel: 'Join as Volunteer',
        ctaLabelHi: 'स्वयंसेवक बनें',
        ctaLink: '/volunteer',
        isActive: true,
      },
      {
        id: '1',
        slug: 'independence-day-celebration',
        title: 'Independence Day Celebration',
        titleHi: 'स्वतंत्रता दिवस समारोह',
        date: '2026-08-15',
        time: '9:00 AM – 12:00 PM',
        location: 'VSS Campus, Narsinghpur',
        locationHi: 'वीएसएस कैंपस, नरसिंहपुर',
        description:
          'A special celebration with children, volunteers and community members highlighting inclusion, patriotism and togetherness.',
        descriptionHi:
          'बच्चों, स्वयंसेवकों और समुदाय के सदस्यों के साथ समावेशन, देशभक्ति और एकता पर आधारित विशेष समारोह।',
        image:
          'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
        ctaLabel: 'Join as Volunteer',
        ctaLabelHi: 'स्वयंसेवक बनें',
        ctaLink: '/volunteer',
        isActive: true,
      },
      {
        id: '2',
        slug: "teachers-day-program",
        title: "Teacher's Day Program",
        titleHi: 'शिक्षक दिवस कार्यक्रम',
        date: '2026-09-05',
        time: '10:00 AM – 1:00 PM',
        location: 'Education Centre, Kandeli',
        locationHi: 'शिक्षा केंद्र, कंदेली',
        description:
          'Honoring educators and mentors who support inclusive education for children with disabilities.',
        descriptionHi:
          'दिव्यांग बच्चों के लिए समावेशी शिक्षा का समर्थन करने वाले शिक्षकों और मार्गदर्शकों का सम्मान।',
        image:
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
        ctaLabel: 'Join as Volunteer',
        ctaLabelHi: 'स्वयंसेवक बनें',
        ctaLink: '/volunteer',
        isActive: true,
      },
      {
        id: '3',
        slug: 'distribution-program',
        title: 'Distribution Program',
        titleHi: 'वितरण कार्यक्रम',
        date: '2026-10-02',
        time: '11:00 AM – 3:00 PM',
        location: 'Itwara Bazar, Narsinghpur',
        locationHi: 'इटवारा बाज़ार, नरसिंहपुर',
        description:
          'Community distribution of educational kits and support materials for families of persons with disabilities.',
        descriptionHi:
          'दिव्यांगजनों के परिवारों के लिए शैक्षिक किट और सहयोग सामग्री का सामुदायिक वितरण।',
        image:
          'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
        ctaLabel: 'Join as Volunteer',
        ctaLabelHi: 'स्वयंसेवक बनें',
        ctaLink: '/volunteer',
        isActive: true,
      },
    ],
  },
}
