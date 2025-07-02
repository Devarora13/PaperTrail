const express = require("express")
const Client = require("../models/Client")
const Invoice = require("../models/Invoice")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all clients for user
router.get("/", auth, async (req, res) => {
  try {
    const clients = await Client.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(clients)
  } catch (error) {
    console.error("Get clients error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single client
router.get("/:id", auth, async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, user: req.userId })
    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }
    res.json(client)
  } catch (error) {
    console.error("Get client error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new client
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone, address, gstin } = req.body

    // Check if client already exists for this user
    const existingClient = await Client.findOne({ email, user: req.userId })
    if (existingClient) {
      return res.status(400).json({ message: "Client with this email already exists" })
    }

    const client = new Client({
      name,
      email,
      phone,
      address,
      gstin,
      user: req.userId,
    })

    await client.save()
    res.status(201).json(client)
  } catch (error) {
    console.error("Create client error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update client
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, email, phone, address, gstin } = req.body

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, email, phone, address, gstin },
      { new: true, runValidators: true },
    )

    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }

    res.json(client)
  } catch (error) {
    console.error("Update client error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete client
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if client has any invoices
    const invoiceCount = await Invoice.countDocuments({ client: req.params.id, user: req.userId })

    if (invoiceCount > 0) {
      return res.status(400).json({
        message: "Cannot delete client with associated invoices",
        invoiceCount,
      })
    }

    const client = await Client.findOneAndDelete({ _id: req.params.id, user: req.userId })
    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }

    res.json({ message: "Client deleted successfully" })
  } catch (error) {
    console.error("Delete client error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
