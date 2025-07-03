
import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Mail, Phone, AlertTriangle } from "lucide-react"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import ClientModal from "../components/ClientModal"

const Clients = () => {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [deleteWarning, setDeleteWarning] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredClients(filtered)
  }, [clients, searchTerm])

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients")
      setClients(response.data)
    } catch (error) {
      addToast("Error fetching clients", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = () => {
    setEditingClient(null)
    setShowModal(true)
  }

  const handleEditClient = (client) => {
    setEditingClient(client)
    setShowModal(true)
  }

  const handleDeleteClient = async (client) => {
    try {
      // First check for associated invoices
      const response = await api.delete(`/clients/${client._id}`);
      
      if (response.status === 200) {
        setClients(clients.filter((c) => c._id !== client._id));
        addToast("Client deleted successfully", "success");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        // Show the modal with invoice count
        setDeleteWarning({
          client,
          invoiceCount: error.response.data.invoiceCount
        });
      } else {
        addToast("Error deleting client", "error");
      }
    }
  }

  const handleClientSaved = (savedClient) => {
    if (editingClient) {
      setClients(clients.map((client) => (client._id === savedClient._id ? savedClient : client)))
      addToast("Client updated successfully", "success")
    } else {
      setClients([...clients, savedClient])
      addToast("Client added successfully", "success")
    }
    setShowModal(false)
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading clients...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Clients</h1>
          <p>Manage your client information and contacts</p>
        </div>
        <button onClick={handleAddClient} className="btn btn-primary">
          <Plus size={20} />
          Add Client
        </button>
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="clients-grid">
        {filteredClients.map((client) => (
          <div key={client._id} className="client-card">
            <div className="client-header">
              <h3>{client.name}</h3>
              <div className="client-actions">
                <button onClick={() => handleEditClient(client)} className="btn-icon">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteClient(client)} className="btn-icon danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="client-info">
              <div className="info-item">
                <Mail size={16} />
                <span>{client.email}</span>
              </div>
              <div className="info-item">
                <Phone size={16} />
                <span>{client.phone}</span>
              </div>
              <div className="info-item">
                <span className="address">
                  {client.address.street}, {client.address.city}, {client.address.state} - {client.address.pincode}
                </span>
              </div>
              {client.gstin && (
                <div className="info-item">
                  <span>GSTIN: {client.gstin}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="empty-state">
          <p>No clients found</p>
          <button onClick={handleAddClient} className="btn btn-primary">
            <Plus size={20} />
            Add Your First Client
          </button>
        </div>
      )}

      <ClientModal
        client={editingClient}
        onSave={handleClientSaved}
        onClose={() => setShowModal(false)}
        isOpen={showModal}
      />

      {/* Delete Warning Modal */}
      {deleteWarning && (
        <div className="modal-overlay" onClick={() => setDeleteWarning(null)}>
          <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className="warning-icon">
              <AlertTriangle size={48} />
            </div>
            <h3>Cannot Delete Client</h3>
            <p>
              <strong>{deleteWarning.client.name}</strong> has {deleteWarning.invoiceCount} invoice(s) associated.
              Please delete or reassign the invoices before deleting this client.
            </p>
            <div className="warning-actions">
              <button onClick={() => setDeleteWarning(null)} className="btn btn-primary">
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients
