const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")
const { upload } = require("../configs/cloudinary");

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

    const user = await User.findById(req.userId);

    if (req.file && req.file.path) {
      //  Delete old logo from Cloudinary
      if (user.companyLogoPublicId) {
        const { cloudinary } = require("../configs/cloudinary");
        await cloudinary.uploader.destroy(user.companyLogoPublicId);
      }

      //  Save new logo
      updateData.companyLogo = req.file.path; // Cloudinary secure_url
      updateData.companyLogoPublicId = req.file.filename; // Public ID generated in multer-storage-cloudinary
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
