import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="container-page max-w-xl text-center">
        <p className="section-label">404</p>
        <h1 className="section-title">Page Not Found</h1>
        <p className="section-desc mx-auto">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back to Home
        </Link>
      </div>
    </section>
  )
}
