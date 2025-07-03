
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import {
  FileText,
  Users,
  CreditCard,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Sun,
  Moon,
} from "lucide-react"

const Home = () => {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const features = [
    {
      icon: FileText,
      title: "Professional Invoices",
      description: "Create stunning, professional invoices with multiple templates and PDF generation.",
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Organize and manage all your clients with detailed contact information and history.",
    },
    {
      icon: CreditCard,
      title: "Payment Integration",
      description: "Accept payments instantly with Razorpay integration and automatic status updates.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your revenue, monitor payment status, and analyze business performance.",
    },
    {
      icon: Zap,
      title: "Bulk Operations",
      description: "Upload CSV files to create multiple invoices at once and save valuable time.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security and regular backups.",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Freelance Designer",
      content:
        "PAPERTRAIL has transformed how I handle invoicing. The professional templates and payment integration have improved my cash flow significantly.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Consulting Agency Owner",
      content:
        "The bulk invoice feature saves me hours every month. Perfect for agencies managing multiple clients and projects.",
      rating: 5,
    },
    {
      name: "Anita Patel",
      role: "Small Business Owner",
      content:
        "Simple, elegant, and powerful. Everything I need to manage my invoicing without the complexity of expensive software.",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for freelancers getting started",
      features: ["Up to 10 invoices/month", "Basic templates", "Client management", "Email support"],
      popular: false,
    },
    {
      name: "Professional",
      price: "₹999/month",
      description: "Ideal for growing businesses",
      features: [
        "Unlimited invoices",
        "Premium templates",
        "Payment integration",
        "Analytics dashboard",
        "Bulk operations",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹2999/month",
      description: "For large teams and agencies",
      features: [
        "Everything in Professional",
        "Multi-user access",
        "Custom branding",
        "API access",
        "Dedicated support",
        "Custom integrations",
      ],
      popular: false,
    },
  ]

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <nav className="home-nav">
          <div className="nav-brand">
            <h2>📄 PAPERTRAIL</h2>
          </div>
          <div className="nav-actions">
            <button onClick={toggleTheme} className="theme-toggle">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Professional Invoicing
              <span className="gradient-text"> Made Simple</span>
            </h1>
            <p className="hero-description">
              Create, send, and track professional invoices with ease. Built for freelancers, small businesses, and
              agencies who want to get paid faster.
            </p>
            <div className="hero-buttons">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Start Free Trial
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Invoices Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">₹50Cr+</span>
                <span className="stat-label">Revenue Processed</span>
              </div>
              <div className="stat">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="invoice-preview">
              <div className="invoice-header">
                <div className="invoice-logo"></div>
                <div className="invoice-details">
                  <div className="detail-line"></div>
                  <div className="detail-line short"></div>
                </div>
              </div>
              <div className="invoice-body">
                <div className="invoice-row">
                  <div className="row-item"></div>
                  <div className="row-item short"></div>
                  <div className="row-item"></div>
                </div>
                <div className="invoice-row">
                  <div className="row-item"></div>
                  <div className="row-item short"></div>
                  <div className="row-item"></div>
                </div>
                <div className="invoice-row">
                  <div className="row-item"></div>
                  <div className="row-item short"></div>
                  <div className="row-item"></div>
                </div>
              </div>
              <div className="invoice-total">
                <div className="total-line"></div>
                <div className="total-line bold"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need to manage invoices</h2>
            <p>Powerful features designed to streamline your billing process</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Loved by thousands of businesses</h2>
            <p>See what our customers have to say about PAPERTRAIL</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.name.charAt(0)}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Simple, transparent pricing</h2>
            <p>Choose the plan that's right for your business</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">{plan.price}</div>
                  <p>{plan.description}</p>
                </div>
                <div className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-item">
                      <CheckCircle size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className={`btn ${plan.popular ? "btn-primary" : "btn-outline"} btn-large`}
                >
                  {user ? "Go to Dashboard" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to streamline your invoicing?</h2>
            <p>Join thousands of businesses already using PAPERTRAIL to get paid faster</p>
            <div className="cta-buttons">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Start Free Trial
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>📄 PAPERTRAIL</h3>
              <p>Professional invoicing made simple</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <Link to="/features">Features</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/templates">Templates</Link>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <Link to="/help">Help Center</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/api">API Docs</Link>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <Link to="/about">About</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/careers">Careers</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PAPERTRAIL. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
