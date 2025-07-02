const express = require("express")
const Invoice = require("../models/Invoice")
const Client = require("../models/Client")
const auth = require("../middleware/auth")

const router = express.Router()

// Get dashboard statistics
router.get("/stats", auth, async (req, res) => {
  try {
    // Get all invoices for the user
    const invoices = await Invoice.find({ user: req.userId })
    const clients = await Client.find({ user: req.userId })

    // Calculate statistics
    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const paidRevenue = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.total, 0)
    const unpaidRevenue = totalRevenue - paidRevenue

    const stats = {
      totalRevenue,
      paidRevenue,
      unpaidRevenue,
      totalInvoices: invoices.length,
      totalClients: clients.length,
      pendingInvoices: invoices.filter((invoice) => invoice.status === "pending").length,
      overdueInvoices: invoices.filter((invoice) => {
        return invoice.status === "pending" && new Date(invoice.dueDate) < new Date()
      }).length,
    }

    res.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get recent activity
router.get("/activity", auth, async (req, res) => {
  try {
    const recentInvoices = await Invoice.find({ user: req.userId }).populate("client").sort({ createdAt: -1 }).limit(10)

    const recentClients = await Client.find({ user: req.userId }).sort({ createdAt: -1 }).limit(5)

    res.json({
      recentInvoices,
      recentClients,
    })
  } catch (error) {
    console.error("Dashboard activity error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get revenue analytics
router.get("/analytics", auth, async (req, res) => {
  try {
    const { period = "month" } = req.query

    let dateRange
    const now = new Date()

    switch (period) {
      case "week":
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "year":
        dateRange = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const invoices = await Invoice.find({
      user: req.userId,
      createdAt: { $gte: dateRange },
    }).populate("client")

    // Group invoices by date
    const analytics = {}
    invoices.forEach((invoice) => {
      const date = invoice.createdAt.toISOString().split("T")[0]
      if (!analytics[date]) {
        analytics[date] = {
          date,
          revenue: 0,
          invoices: 0,
          paid: 0,
          pending: 0,
        }
      }
      analytics[date].revenue += invoice.total
      analytics[date].invoices += 1
      if (invoice.status === "paid") {
        analytics[date].paid += invoice.total
      } else {
        analytics[date].pending += invoice.total
      }
    })

    res.json(Object.values(analytics).sort((a, b) => new Date(a.date) - new Date(b.date)))
  } catch (error) {
    console.error("Dashboard analytics error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
