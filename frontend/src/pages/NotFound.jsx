"use client"

import { Link } from "react-router-dom"
import { Home, ArrowLeft, FileQuestion } from "lucide-react"

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FileQuestion size={120} />
        </div>

        <div className="not-found-text">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
        </div>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={20} />
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline">
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="not-found-links">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/invoices">Invoices</Link>
            <Link to="/clients">Clients</Link>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
