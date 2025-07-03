
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Eye, Download, Mail } from "lucide-react"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    let filtered = invoices

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter])

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices")
      setInvoices(response.data.invoices || response.data)
    } catch (error) {
      addToast("Error fetching invoices", "error")
    } finally {
      setLoading(false)
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
      addToast("Error downloading PDF", "error")
    }
  }

  const handleSendEmail = async (invoiceId) => {
    try {
      await api.post(`/invoices/${invoiceId}/send-email`)
      addToast("Invoice sent successfully", "success")
    } catch (error) {
      addToast("Error sending invoice", "error")
    }
  }

  if (loading) {
    return <div className="loading">Loading invoices...</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Invoices</h1>
        <div className="button-group">
          <Link to="/bulk-invoice" className="btn btn-outline">
            <Plus size={20} />
            Bulk Upload
          </Link>
          <Link to="/invoices/create" className="btn btn-primary">
            <Plus size={20} />
            Create Invoice
          </Link>
        </div>
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="invoices-table">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
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
                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/invoices/${invoice._id}`} className="btn-icon" title="View">
                      <Eye size={16} />
                    </Link>
                    <button onClick={() => handleDownloadPDF(invoice._id)} className="btn-icon" title="Download PDF">
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

      {filteredInvoices.length === 0 && (
        <div className="empty-state">
          <p>No invoices found</p>
          <Link to="/invoices/create" className="btn btn-primary">
            <Plus size={20} />
            Create Your First Invoice
          </Link>
        </div>
      )}
    </div>
  )
}

export default Invoices
