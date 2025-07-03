
import { useState, useEffect } from "react"
import { Save, Upload, Building, Percent, Phone, MapPin, Camera } from "lucide-react"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import { useAuth } from "../contexts/AuthContext"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("business")
  const [businessData, setBusinessData] = useState({
    businessname: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    gstin: "",
    defaultTaxRate: 18,
    companyLogo: "",
  })
  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")
  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    if (user) {
      setBusinessData({
        businessname: user.businessname || "",
        phone: user.phone || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
        gstin: user.gstin || "",
        defaultTaxRate: user.defaultTaxRate || 18,
        companyLogo: user.companyLogo || "",
      })
      setLogoPreview(user.companyLogo || "")
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]
      setBusinessData({
        ...businessData,
        address: {
          ...businessData.address,
          [addressField]: value,
        },
      })
    } else {
      setBusinessData({
        ...businessData,
        [name]: value,
      })
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast("Logo file size should be less than 5MB", "error")
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      setLogoFile(file)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)

    try {
      const formData = new FormData()

      // Append business data
      Object.keys(businessData).forEach((key) => {
        if (key === "address") {
          Object.keys(businessData.address).forEach((addressKey) => {
            formData.append(`address.${addressKey}`, businessData.address[addressKey])
          })
        } else if (key !== "companyLogo") {
          formData.append(key, businessData[key])
        }
      })

      // Append logo file if selected
      if (logoFile) {
        formData.append("logo", logoFile)
      }

      const response = await api.put("/settings/business", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      addToast("Settings saved successfully", "success")

      // Update business data with response
      setBusinessData(response.data)
      setLogoFile(null)

      // Update logo preview with server response
      if (response.data.companyLogo) {
        setLogoPreview(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${response.data.companyLogo}`)
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Error saving settings", "error")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "business", label: "Business Info", icon: Building },
    { id: "tax", label: "Tax Settings", icon: Percent },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your business information and preferences</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="settings-content">
          {activeTab === "business" && (
            <div className="settings-panel">
              <div className="panel-header">
                <h2>Business Information</h2>
                <p>Update your business details that appear on invoices</p>
              </div>

              <div className="settings-form">
                <div className="form-section">
                  <h3>Company Logo</h3>
                  <div className="logo-upload-section">
                    <div className="logo-preview">
                      {logoPreview ? (
                        <img src={logoPreview || "/placeholder.svg"} alt="Company Logo" className="logo-image" />
                      ) : (
                        <div className="logo-placeholder">
                          <Camera size={32} />
                          <span>No Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="logo-upload-controls">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="file-input"
                      />
                      <label htmlFor="logo" className="btn btn-outline">
                        <Upload size={20} />
                        {logoFile ? logoFile.name : "Choose Logo"}
                      </label>
                      <p className="file-help">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Business Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="businessname">Business Name *</label>
                      <div className="input-group">
                        <Building className="input-icon" size={20} />
                        <input
                          type="text"
                          id="businessname"
                          name="businessname"
                          value={businessData.businessname}
                          onChange={handleInputChange}
                          placeholder="Enter business name"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <div className="input-group">
                        <Phone className="input-icon" size={20} />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={businessData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="gstin">GSTIN (Optional)</label>
                      <input
                        type="text"
                        id="gstin"
                        name="gstin"
                        value={businessData.gstin}
                        onChange={handleInputChange}
                        placeholder="Enter GSTIN"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Address Information</h3>
                  <div className="form-group">
                    <label htmlFor="address.street">Street Address *</label>
                    <div className="input-group">
                      <MapPin className="input-icon" size={20} />
                      <input
                        type="text"
                        id="address.street"
                        name="address.street"
                        value={businessData.address.street}
                        onChange={handleInputChange}
                        placeholder="Enter street address"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="address.city">City *</label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={businessData.address.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.state">State *</label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={businessData.address.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.pincode">Pincode *</label>
                      <input
                        type="text"
                        id="address.pincode"
                        name="address.pincode"
                        value={businessData.address.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter pincode"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tax" && (
            <div className="settings-panel">
              <div className="panel-header">
                <h2>Tax Settings</h2>
                <p>Configure default tax rates for your invoices</p>
              </div>

              <div className="settings-form">
                <div className="form-section">
                  <h3>Default Tax Configuration</h3>
                  <div className="form-group">
                    <label htmlFor="defaultTaxRate">Default Tax Rate (%)</label>
                    <div className="input-group">
                      <Percent className="input-icon" size={20} />
                      <input
                        type="number"
                        id="defaultTaxRate"
                        name="defaultTaxRate"
                        value={businessData.defaultTaxRate}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="18.00"
                      />
                    </div>
                    <p className="field-help">This will be the default tax rate for new invoices</p>
                  </div>
                </div>

                <div className="tax-info-section">
                  <h3>Common Tax Rates in India</h3>
                  <div className="tax-rates-grid">
                    <div className="tax-rate-card">
                      <span className="rate">0%</span>
                      <span className="description">Essential goods, services</span>
                    </div>
                    <div className="tax-rate-card">
                      <span className="rate">5%</span>
                      <span className="description">Basic necessities</span>
                    </div>
                    <div className="tax-rate-card">
                      <span className="rate">12%</span>
                      <span className="description">Standard goods</span>
                    </div>
                    <div className="tax-rate-card">
                      <span className="rate">18%</span>
                      <span className="description">Most services, IT services</span>
                    </div>
                    <div className="tax-rate-card">
                      <span className="rate">28%</span>
                      <span className="description">Luxury goods</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button onClick={handleSaveSettings} className="btn btn-primary" disabled={loading}>
              <Save size={20} />
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
