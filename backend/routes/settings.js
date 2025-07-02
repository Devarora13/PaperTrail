const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")

const router = express.Router()

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/logos/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "logo-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Get user settings
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get settings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update business settings
router.put("/business", auth, upload.single("logo"), async (req, res) => {
  try {
    const {
      businessname,
      phone,
      gstin,
      defaultTaxRate,
      "address.street": street,
      "address.city": city,
      "address.state": state,
      "address.pincode": pincode,
      "address.country": country,
    } = req.body

    const updateData = {
      businessname,
      phone,
      gstin,
      defaultTaxRate: Number.parseFloat(defaultTaxRate) || 18,
      address: {
        street,
        city,
        state,
        pincode,
        country: country || "India",
      },
    }

    // Add logo path if file was uploaded
    if (req.file) {
      updateData.companyLogo = `/uploads/logos/${req.file.filename}`
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    res.json(user)
  } catch (error) {
    console.error("Update business settings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update tax settings
router.put("/tax", auth, async (req, res) => {
  try {
    const { defaultTaxRate } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      { defaultTaxRate: Number.parseFloat(defaultTaxRate) || 18 },
      { new: true, runValidators: true },
    ).select("-password")

    res.json(user)
  } catch (error) {
    console.error("Update tax settings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update notification settings
router.put("/notifications", auth, async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, reminderDays } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
        smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
        reminderDays: Number.parseInt(reminderDays) || 7,
      },
      { new: true, runValidators: true },
    ).select("-password")

    res.json(user)
  } catch (error) {
    console.error("Update notification settings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
