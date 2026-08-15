# Viklang Sewa Sansthan Website

Premium modern NGO website for **Viklang Sewa Sansthan**, Narsinghpur, Madhya Pradesh.

Tagline: *Empowering Lives. Creating Possibilities.*

## Tech Stack

- React (JavaScript / JSX)
- Vite
- React Router
- Tailwind CSS v4
- Lucide React
- Framer Motion
- Axios

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/     # Reusable homepage & UI sections
  pages/          # Public pages + admin shell
  data/           # Dummy JSON-like content (API-ready)
  services/       # Axios API layer with local fallback
  hooks/          # Shared React hooks
  context/        # Accessibility settings
  utils/          # Format helpers
```

## Page Map

- Home
- About → Our Story, Mission & Vision, Our Team, Our Journey
- Programs → Education, Rehabilitation, Skill Development, Healthcare, Community Development, Social Inclusion
- Impact → Success Stories, Activities, Statistics
- News & Events → Blog, News, Events
- Gallery → Photos, Videos
- Get Involved → Volunteer, Partner, Fundraise
- Donate
- Reports & Documents
- Contact
- Admin → Dashboard, Blogs, Events, Gallery, Volunteers, Donations, Campaigns, Documents, Enquiries

## API Switch

By default the site uses local dummy data in `src/data`.

To switch to a real backend later:

1. Copy `.env.example` to `.env`
2. Set `VITE_USE_API=true`
3. Set `VITE_API_BASE_URL` to your API base URL

## Notes

- Impact numbers and certificate documents are placeholders until verified data is provided.
- Organization logo is served from `public/logo.png`.
- Accessibility widget supports text size, high contrast and read aloud.
