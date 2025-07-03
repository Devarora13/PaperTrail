
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Download, Mail, Trash2, CreditCard, ArrowLeft, FileText } from "lucide-react"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"

const InvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    fetchInvoice()
  }, [id])

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${id}`)
      setInvoice(response.data)
    } catch (error) {
      addToast("Error fetching invoice", "error")
      navigate("/invoices")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: "blob",
      })

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `invoice-${invoice.invoiceNumber}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)

      addToast("PDF downloaded successfully", "success")
    } catch (error) {
      addToast("PDF generation feature coming soon", "info")
    }
  }

  const handleSendEmail = async () => {
    try {
      await api.post(`/invoices/${id}/send-email`)
      addToast("Invoice sent successfully", "success")
    } catch (error) {
      addToast("Email feature coming soon", "info")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await api.delete(`/invoices/${id}`)
        addToast("Invoice deleted successfully", "success")
        navigate("/invoices")
      } catch (error) {
        addToast("Error deleting invoice", "error")
      }
    }
  }

  const handlePayment = async () => {
    try {
      const response = await api.post(`/invoices/${id}/create-payment`)
      window.open(response.data.paymentUrl, "_blank")
    } catch (error) {
      addToast("Payment integration coming soon", "info")
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
        <div className="loading">Loading invoice...</div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="page-container">
        <div className="error-state">
          <FileText size={48} />
          <h2>Invoice Not Found</h2>
          <p>The invoice you're looking for doesn't exist or has been deleted.</p>
          <Link to="/invoices" className="btn btn-primary">
            Back to Invoices
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="invoice-detail-header">
        <div className="header-left">
          <Link to="/invoices" className="back-btn">
            <ArrowLeft size={20} />
            Back to Invoices
          </Link>
          <div className="invoice-title">
            <h1>Invoice #{invoice.invoiceNumber}</h1>
            <span className={`status ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
          </div>
        </div>

        <div className="button-group">
          <button onClick={handleDownloadPDF} className="btn btn-outline">
            <Download size={20} />
            Download PDF
          </button>
          <button onClick={handleSendEmail} className="btn btn-outline">
            <Mail size={20} />
            Send Email
          </button>
          {/* {invoice.status !== "paid" && (
            <button onClick={handlePayment} className="btn btn-primary">
              <CreditCard size={20} />
              Pay Now
            </button>
          )} */}
          <button onClick={handleDelete} className="btn btn-outline danger">
            <Trash2 size={20} />
            Delete
          </button>
        </div>
      </div>

      <div className="invoice-content">
        <div className="invoice-card">
          <div className="invoice-header-section">
            <div className="company-info">
              <h2>📄 PAPERTRAIL</h2>
              <p>Professional Invoice Management</p>
            </div>
            <div className="invoice-meta">
              <div className="meta-item">
                <label>Invoice Number:</label>
                <span>#{invoice.invoiceNumber}</span>
              </div>
              <div className="meta-item">
                <label>Issue Date:</label>
                <span>{new Date(invoice.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <label>Due Date:</label>
                <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <label>Status:</label>
                <span className={`status ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
              </div>
            </div>
          </div>

          <div className="invoice-parties">
            <div className="bill-to">
              <h3>Bill To:</h3>
              <div className="client-details">
                <h4>{invoice.client.name}</h4>
                <p>{invoice.client.email}</p>
                <p>{invoice.client.phone}</p>
                <div className="address">
                  <p>{invoice.client.address.street}</p>
                  <p>
                    {invoice.client.address.city}, {invoice.client.address.state} - {invoice.client.address.pincode}
                  </p>
                  <p>{invoice.client.address.country}</p>
                </div>
                {invoice.client.gstin && (
                  <p>
                    <strong>GSTIN:</strong> {invoice.client.gstin}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="invoice-items-section">
            <h3>Invoice Items</h3>
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="item-description">{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{formatCurrency(item.discount || 0)}</td>
                      <td className="item-total">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="invoice-summary-section">
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="invoice-notes-section">
              <h3>Notes & Terms</h3>
              <p>{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail
