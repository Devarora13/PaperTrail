import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ToastProvider } from "./contexts/ToastContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Clients from "./pages/Clients"
import Invoices from "./pages/Invoices"
import CreateInvoice from "./pages/CreateInvoice"
import InvoiceDetail from "./pages/InvoiceDetail"
import BulkInvoice from "./pages/BulkInvoice"
import Settings from "./pages/Settings"
import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes with navbar */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                          <Dashboard />
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clients"
                  element={
                    <ProtectedRoute>
                      <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                          <Clients />
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoices"
                  element={
                    <ProtectedRoute>
                      <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                          <Invoices />
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoices/create"
                  element={
                    <ProtectedRoute>
                      <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                          <CreateInvoice />
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoices/:id"
                  element={
                    <ProtectedRoute>
                      <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                          <InvoiceDetail />
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bulk-invoice"
                  element={
                    <ProtectedRoute>
                      <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                          <BulkInvoice />
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                          <Settings />
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
