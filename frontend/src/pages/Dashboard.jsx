
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { DollarSign, FileText, Users, TrendingUp, Plus, Eye, Download, Mail } from "lucide-react"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidRevenue: 0,
    unpaidRevenue: 0,
    totalInvoices: 0,
    totalClients: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, invoicesResponse] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/invoices?limit=5"),
      ])

      setStats(statsResponse.data)
      setRecentInvoices(invoicesResponse.data.invoices || invoicesResponse.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      addToast("Error loading dashboard data", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/pdf`, {
        responseType: "blob",
      })

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `invoice-${invoiceId}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)

      addToast("PDF downloaded successfully", "success")
    } catch (error) {
      addToast("PDF generation feature coming soon", "info")
    }
  }

  const handleSendEmail = async (invoiceId) => {
    try {
      await api.post(`/invoices/${invoiceId}/send-email`)
      addToast("Invoice sent successfully", "success")
    } catch (error) {
      addToast("Email feature coming soon", "info")
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "status-paid"
      case "pending":
        return "status-pending"
      case "overdue":
        return "status-overdue"
      default:
        return "status-draft"
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your business.</p>
        </div>
        <Link to="/invoices/create" className="btn btn-primary">
          <Plus size={20} />
          Create Invoice
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon paid">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Paid Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.paidRevenue)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Unpaid Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.unpaidRevenue)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Invoices</h3>
            <p className="stat-value">{stats.totalInvoices}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Clients</h3>
            <p className="stat-value">{stats.totalClients}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-invoices">
          <div className="section-header">
            <h2>Recent Invoices</h2>
            <Link to="/invoices" className="btn btn-outline">
              View All
            </Link>
          </div>

          {recentInvoices.length > 0 ? (
            <div className="invoices-table">
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td>
                        <Link to={`/invoices/${invoice._id}`} className="invoice-link">
                          #{invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td>{invoice.client?.name || "Unknown Client"}</td>
                      <td>{formatCurrency(invoice.total)}</td>
                      <td>
                        <span className={`status ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                      </td>
                      <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/invoices/${invoice._id}`} className="btn-icon" title="View">
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleDownloadPDF(invoice._id)}
                            className="btn-icon"
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </button>
                          <button onClick={() => handleSendEmail(invoice._id)} className="btn-icon" title="Send Email">
                            <Mail size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={48} />
              <h3>No invoices yet</h3>
              <p>Create your first invoice to get started</p>
              <Link to="/invoices/create" className="btn btn-primary">
                <Plus size={20} />
                Create Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
