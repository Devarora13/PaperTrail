const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Import routes
const authRoutes = require("./routes/auth")
const clientRoutes = require("./routes/clients")
const invoiceRoutes = require("./routes/invoices")
const dashboardRoutes = require("./routes/dashboard")
const settingsRoutes = require("./routes/settings")

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create upload directories if they don't exist
const fs = require("fs")
const uploadDirs = ["uploads", "uploads/csv", "uploads/logos", "uploads/pdfs"]
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/clients", clientRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/settings", settingsRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "PAPERTRAIL API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/papertrail")
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
