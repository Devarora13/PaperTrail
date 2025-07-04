import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  Home,
  Users,
  FileText,
  Plus,
  Upload,
  Settings,
  LogOut,
  Sun,
  Moon,
  BarChart3,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/clients", icon: Users, label: "Clients" },
    { path: "/invoices", icon: FileText, label: "Invoices" },
    { path: "/invoices/create", icon: Plus, label: "Create Invoice" },
    { path: "/bulk-invoice", icon: Upload, label: "Bulk Invoice" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <h2>📄 PAPERTRAIL</h2>
        </Link>
      </div>

      <div className="navbar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="navbar-actions">
        <button onClick={toggleTheme} className="theme-toggle">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="user-menu">
          <div className="user-info">
            {user?.companyLogo ? (
              <img
                src={user.companyLogo}
                alt="Logo"
                className="user-avatar user-avatar-img"
              />
            ) : (
              <div className="user-avatar">
                {user?.businessname?.charAt(0) || "U"}
              </div>
            )}

            <div className="user-details">
              <span className="user-name">{user?.businessname}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
