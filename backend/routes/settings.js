const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")
const { upload, cloudinary } = require("../configs/cloudinary");

const router = express.Router()

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
    } = req.body;

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
    };

    if (req.file && req.file.path && req.file.filename) {
      // If previous public ID exists, delete it
      const user = await User.findById(req.userId);

      if (user.companyLogoPublicId && user.companyLogoPublicId !== req.file.filename) {
        await cloudinary.uploader.destroy(user.companyLogoPublicId);
      }

      updateData.companyLogo = req.file.path; // secure_url
      updateData.companyLogoPublicId = req.file.filename; // public_id
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Update business settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


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
