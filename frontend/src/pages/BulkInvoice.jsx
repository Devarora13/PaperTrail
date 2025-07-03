

import { useState } from "react"
import { Upload, Download, FileText, AlertCircle, CheckCircle, Palette } from "lucide-react"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import InvoiceTemplateSelector from "../components/InvoiceTemplateSelector"
import { useNavigate } from "react-router-dom"

const BulkInvoice = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState(null)
  const [templateId, setTemplateId] = useState("1") // default template
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const navigate = useNavigate() 

  const { addToast } = useToast()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setResults(null)
    } else {
      addToast("Please select a valid CSV file", "error")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      addToast("Please select a CSV file", "error")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("csvFile", file)
    formData.append("templateId", templateId)

    try {
      const response = await api.post("/invoices/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setResults(response.data)
      addToast(`Successfully created ${response.data.successful} invoices`, "success")
      if (response.data.successful > 0) {
      navigate("/invoices")
}

    } catch (error) {
      addToast(error.response?.data?.message || "Error uploading file", "error")
    } finally {
      setUploading(false)
    }
  }

  const downloadCsvFormat = () => {
    const csvContent = `Client Name,Client Email,Client Phone,Client Street,Client City,Client State,Client Pincode,Client GSTIN,Item Description,Quantity,Unit Price,Discount,Due Date,Notes
John Doe,john@example.com,9876543210,123 Main St,Mumbai,Maharashtra,400001,27ABCDE1234F1Z5,Web Development,1,50000,0,2024-02-15,Payment terms: Net 30
Jane Smith,jane@example.com,9876543211,456 Oak Ave,Delhi,Delhi,110001,,Logo Design,2,15000,1000,2024-02-20,Rush order
Jane Smith,jane@example.com,456 Oak Ave,Delhi,Delhi,110001,,Business Cards,500,10,0,2024-02-20,High quality print`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "invoice-template.csv"
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Bulk Invoice Upload</h1>
          <p>Create multiple invoices at once using CSV file upload</p>
        </div>
        <div className="button-group">
          <button onClick={downloadCsvFormat} className="btn btn-outline">
            <Download size={20} />
            Download CSV Format
          </button>
          <button onClick={() => setShowTemplateSelector(true)} className="btn btn-outline">
            <Palette size={20} />
            Choose Template
          </button>
        </div>
      </div>

      <div className="bulk-upload-grid">
        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-icon">
              <Upload size={48} />
            </div>
            <h2>Upload CSV File</h2>
            <p>Select a CSV file to create multiple invoices at once</p>

            <div className="file-upload-area">
              <input type="file" accept=".csv" onChange={handleFileChange} className="file-input" id="csvFile" />
              <label htmlFor="csvFile" className="file-upload-label">
                <Upload size={24} />
                <span>{file ? file.name : "Choose CSV File"}</span>
                <small>Click to browse or drag and drop</small>
              </label>
            </div>

            {file && (
              <div className="file-info">
                <CheckCircle size={20} />
                <span>File selected: {file.name}</span>
              </div>
            )}

            {file && (
              <button onClick={handleUpload} className="btn btn-primary btn-large" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload & Create Invoices"}
              </button>
            )}
          </div>
        </div>

        <div className="instructions-section">
          <div className="instructions-card">
            <h2>CSV Format Instructions</h2>

            <div className="instruction-list">
              <div className="instruction-item">
                <div className="instruction-icon required">
                  <FileText size={20} />
                </div>
                <div className="instruction-content">
                  <h3>Required Columns</h3>
                  <p>Client Name, Client Email, Item Description, Quantity, Unit Price, Due Date</p>
                </div>
              </div>

              <div className="instruction-item">
                <div className="instruction-icon optional">
                  <AlertCircle size={20} />
                </div>
                <div className="instruction-content">
                  <h3>Optional Columns</h3>
                  <p>Client Phone, Address fields, GSTIN, Discount, Notes</p>
                </div>
              </div>

              <div className="instruction-item">
                <div className="instruction-icon info">
                  <Upload size={20} />
                </div>
                <div className="instruction-content">
                  <h3>Multiple Items per Client</h3>
                  <p>Use the same client email for multiple rows to group items into one invoice</p>
                </div>
              </div>
            </div>

            <div className="sample-data">
              <h3>Sample CSV Format</h3>
              <div className="code-block">
                <pre>
{`Client Name,Client Email,Item Description,Quantity,Unit Price,Due Date
John Doe,john@example.com,Web Development,1,50000,2024-02-15
Jane Smith,jane@example.com,Logo Design,2,15000,2024-02-20
Jane Smith,jane@example.com,Business Cards,500,10,2024-02-20`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {results && (
        <div className="results-section">
          <div className="results-card">
            <h2>Upload Results</h2>

            <div className="results-stats">
              <div className="stat-item success">
                <div className="stat-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{results.successful}</span>
                  <span className="stat-label">Successful</span>
                </div>
              </div>

              <div className="stat-item error">
                <div className="stat-icon">
                  <AlertCircle size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{results.failed}</span>
                  <span className="stat-label">Failed</span>
                </div>
              </div>

              <div className="stat-item info">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{results.newClients}</span>
                  <span className="stat-label">New Clients</span>
                </div>
              </div>
            </div>

            {results.errors && results.errors.length > 0 && (
              <div className="error-section">
                <h3>Errors Found</h3>
                <div className="error-list">
                  {results.errors.map((error, index) => (
                    <div key={index} className="error-item">
                      <AlertCircle size={16} />
                      <span>
                        Row {error.row}: {error.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.invoices && results.invoices.length > 0 && (
              <div className="success-section">
                <h3>Created Invoices</h3>
                <div className="invoice-grid">
                  {results.invoices.map((invoice) => (
                    <div key={invoice._id} className="invoice-item">
                      <div className="invoice-info">
                        <span className="invoice-number">#{invoice.invoiceNumber}</span>
                        <span className="client-name">{invoice.client.name}</span>
                      </div>
                      <span className="invoice-amount">₹{invoice.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="modal-overlay" onClick={() => setShowTemplateSelector(false)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <InvoiceTemplateSelector
              selectedTemplate={templateId}
              onTemplateSelect={(id) => {
                setTemplateId(id)
                setShowTemplateSelector(false)
              }}
            />
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

export default BulkInvoice
