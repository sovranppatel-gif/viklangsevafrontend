export const dashboardStats = [
  {
    id: 'donations',
    label: 'Total Donations',
    value: '₹2,45,000',
    change: '18.6%',
    changeLabel: 'from last week',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: 'handHeart',
  },
  {
    id: 'volunteers',
    label: 'Total Volunteers',
    value: '128',
    change: '12.5%',
    changeLabel: 'from last week',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    icon: 'users',
  },
  {
    id: 'blogs',
    label: 'Total Blog Posts',
    value: '34',
    change: '8.3%',
    changeLabel: 'from last week',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    icon: 'newspaper',
  },
  {
    id: 'events',
    label: 'Total Events',
    value: '12',
    change: '20%',
    changeLabel: 'from last week',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    icon: 'calendar',
  },
  {
    id: 'enquiries',
    label: 'Total Enquiries',
    value: '47',
    change: '15.2%',
    changeLabel: 'from last week',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    icon: 'mail',
  },
]

export const donationTrend = [
  { day: '08 May', amount: 22000 },
  { day: '09 May', amount: 31000 },
  { day: '10 May', amount: 28000 },
  { day: '11 May', amount: 45000 },
  { day: '12 May', amount: 38000 },
  { day: '13 May', amount: 52000 },
  { day: '14 May', amount: 61000 },
]

export const paymentMethods = [
  { label: 'UPI / QR Code', value: 45, color: '#3B82F6' },
  { label: 'Net Banking', value: 25, color: '#10B981' },
  { label: 'Card Payment', value: 20, color: '#8B5CF6' },
  { label: 'Other', value: 10, color: '#F59E0B' },
]

export const topPrograms = [
  { name: 'Education Support', amount: '₹85,000', percent: 34 },
  { name: 'Rehabilitation', amount: '₹62,000', percent: 25 },
  { name: 'Healthcare', amount: '₹48,000', percent: 20 },
  { name: 'Skill Development', amount: '₹32,000', percent: 13 },
  { name: 'Community Development', amount: '₹18,000', percent: 8 },
]

export const recentDonations = [
  {
    id: 1,
    name: 'Amit Sharma',
    method: 'UPI Payment',
    amount: '₹5,000',
    datetime: '14 May 2026, 10:24 AM',
    status: 'Success',
    initials: 'AS',
    avatarBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    name: 'Neha Verma',
    method: 'Net Banking',
    amount: '₹10,000',
    datetime: '13 May 2026, 06:15 PM',
    status: 'Success',
    initials: 'NV',
    avatarBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    name: 'Rahul Singh',
    method: 'Card Payment',
    amount: '₹2,500',
    datetime: '13 May 2026, 02:40 PM',
    status: 'Success',
    initials: 'RS',
    avatarBg: 'bg-violet-100 text-violet-700',
  },
  {
    id: 4,
    name: 'Priya Patel',
    method: 'UPI Payment',
    amount: '₹7,500',
    datetime: '12 May 2026, 11:05 AM',
    status: 'Success',
    initials: 'PP',
    avatarBg: 'bg-orange-100 text-orange-700',
  },
  {
    id: 5,
    name: 'Vikram Joshi',
    method: 'QR Code',
    amount: '₹3,000',
    datetime: '12 May 2026, 09:18 AM',
    status: 'Success',
    initials: 'VJ',
    avatarBg: 'bg-cyan-100 text-cyan-700',
  },
]

export const upcomingEvents = [
  {
    id: 1,
    day: '15',
    month: 'MAY',
    title: 'Health Checkup Camp',
    location: 'Narsinghpur',
    time: '09:00 AM – 02:00 PM',
  },
  {
    id: 2,
    day: '21',
    month: 'MAY',
    title: 'Assistive Device Distribution',
    location: 'Kandeli Community Hall',
    time: '10:00 AM – 01:00 PM',
  },
  {
    id: 3,
    day: '05',
    month: 'JUN',
    title: 'Skill Training Workshop',
    location: 'VSS Training Centre',
    time: '11:00 AM – 04:00 PM',
  },
]

export const recentBlogs = [
  {
    id: 1,
    title: 'Empowering Children Through Inclusive Education',
    date: '12 May 2026',
    status: 'Published',
    thumb: 'from-blue-400 to-navy',
  },
  {
    id: 2,
    title: 'How Rehabilitation Changes Lives in Rural MP',
    date: '08 May 2026',
    status: 'Published',
    thumb: 'from-emerald-400 to-emerald-700',
  },
  {
    id: 3,
    title: 'Community Awareness Drive – Draft Notes',
    date: '05 May 2026',
    status: 'Draft',
    thumb: 'from-amber-300 to-orange-500',
  },
]

export const dateRangeLabel = '08 May 2026 - 14 May 2026'
export const notificationCount = 5
