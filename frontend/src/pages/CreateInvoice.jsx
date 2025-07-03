
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Save, Send, Palette } from "lucide-react"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import { useAuth } from "../contexts/AuthContext"
import InvoiceTemplateSelector from "../components/InvoiceTemplateSelector"

const CreateInvoice = () => {
  const [clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    client: "",
    items: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ],
    taxRate: 18,
    dueDate: "",
    notes: "",
    templateId: 1, // Default template ID
  })
  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchClients()
    // Set default due date to 30 days from now
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)
    setFormData((prev) => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split("T")[0],
      taxRate: user?.defaultTaxRate || 18,
    }))
  }, [user])

  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.taxRate])

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients")
      setClients(response.data)
    } catch (error) {
      addToast("Error fetching clients", "error")
    }
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice - (item.discount || 0)
      return sum + itemTotal
    }, 0)

    const taxAmount = (subtotal * formData.taxRate) / 100
    const total = subtotal + taxAmount

    setTotals({
      subtotal,
      taxAmount,
      total,
    })
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value

    // Calculate item total
    const item = updatedItems[index]
    item.total = item.quantity * item.unitPrice - (item.discount || 0)

    setFormData({
      ...formData,
      items: updatedItems,
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          total: 0,
        },
      ],
    })
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        items: updatedItems,
      })
    }
  }

  const handleTemplateSelect = (templateId) => {
    setFormData({
      ...formData,
      templateId: templateId,
    })
    setShowTemplateSelector(false)
  }

  const handleSubmit = async (e, status = "pending") => {
    e.preventDefault()
    setLoading(true)

    try {
      const invoiceData = {
        ...formData,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        total: totals.total,
        status,
      }

      const response = await api.post("/invoices", invoiceData)
      addToast("Invoice created successfully", "success")
      navigate(`/invoices/${response.data._id}`)
    } catch (error) {
      addToast(error.response?.data?.message || "Error creating invoice", "error")
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

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Create New Invoice</h1>
          <p>Create professional invoices for your clients</p>
        </div>
        <button type="button" onClick={() => setShowTemplateSelector(true)} className="btn btn-outline">
          <Palette size={20} />
          Choose Template
        </button>
      </div>

      <form onSubmit={(e) => handleSubmit(e, "pending")} className="invoice-form">
        <div className="form-section">
          <div className="section-header">
            <h2>Invoice Details</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="client">Select Client *</label>
              <select
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                required
                className="form-select"
              >
                <option value="">Choose a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="taxRate">Tax Rate (%)</label>
              <input
                type="number"
                id="taxRate"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number.parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
                step="0.01"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Invoice Items</h2>
            <button type="button" onClick={addItem} className="btn btn-outline">
              <Plus size={20} />
              Add Item
            </button>
          </div>

          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        placeholder="Item description"
                        required
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                        min="1"
                        required
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        required
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, "discount", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="table-input"
                      />
                    </td>
                    <td className="total-cell">{formatCurrency(item.total)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn-icon danger"
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Additional Information</h2>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes & Terms</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes, terms, or payment instructions..."
              rows="4"
              className="form-textarea"
            />
          </div>
        </div>

        <div className="invoice-summary">
          <div className="summary-content">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Tax ({formData.taxRate}%):</span>
              <span>{formatCurrency(totals.taxAmount)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "draft")}
            className="btn btn-outline"
            disabled={loading}
          >
            <Save size={20} />
            Save as Draft
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Send size={20} />
            {loading ? "Creating..." : "Create & Send Invoice"}
          </button>
        </div>
      </form>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="modal-overlay" onClick={() => setShowTemplateSelector(false)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <InvoiceTemplateSelector selectedTemplate={formData.templateId} onTemplateSelect={handleTemplateSelect} />
            <div className="template-modal-actions">
              <button onClick={() => setShowTemplateSelector(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateInvoice
