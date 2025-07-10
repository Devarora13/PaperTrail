const express = require("express");
const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const auth = require("../middleware/auth");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf-node");
const Razorpay = require("razorpay");
const dotenv = require("dotenv").config();
const router = express.Router();

const {
  template1,
  template2,
  template3,
  template4,
  template5,
} = require("../utils/invoiceHtmlTemplates");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure multer for CSV uploads
const upload = multer({ dest: "uploads/csv/" });

// Configure Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// HTML template for PDF generation
const generateInvoiceHTML = (invoice) => {
  switch (invoice.templateId) {
    case 1:
      return template1(invoice);
    case 2:
      return template2(invoice);
    case 3:
      return template3(invoice);
    case 4:
      return template4(invoice);
    case 5:
      return template5(invoice);
  }
};

// Get all invoices for user
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = { user: req.userId };

    // Add status filter
    if (status && status !== "all") {
      query.status = status;
    }

    let invoices = await Invoice.find(query)
      .populate("client")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add search filter
    if (search) {
      invoices = invoices.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          invoice.client.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await Invoice.countDocuments(query);

    res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single invoice
router.get("/:id", auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("client");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new invoice
router.post("/", auth, async (req, res) => {
  try {
    const {
      templateId,
      client,
      items,
      taxRate,
      dueDate,
      notes,
      status = "pending",
    } = req.body;

    // Calculate totals
    let subtotal = 0;
    const processedItems = items.map((item) => {
      const itemTotal = item.quantity * item.unitPrice - (item.discount || 0);
      subtotal += itemTotal;
      return {
        ...item,
        total: itemTotal,
      };
    });

    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const invoice = new Invoice({
      invoiceNumber: `INV-${Date.now()}`,
      templateId,
      client,
      user: req.userId,
      items: processedItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      dueDate,
      notes,
      status,
    });

    await invoice.save();
    await invoice.populate("client");

    // 🔗 Generate Razorpay payment link
    const paymentLinkOptions = {
      amount: Math.round(invoice.total * 100),
      currency: "INR",
      accept_partial: false,
      description: `Payment for Invoice ${invoice.invoiceNumber}`,
      customer: {
        name: invoice.client.name,
        email: invoice.client.email,
        contact: invoice.client.phone || undefined,
      },
      notify: {
        sms: false,
        email: false,
      },
      reminder_enable: true,
      notes: {
        invoice_id: invoice._id.toString(),
        invoice_number: invoice.invoiceNumber,
      },
      callback_url: `${process.env.FRONTEND_URL}/invoices/${invoice._id}/payment-success`,
      callback_method: "get",
    };

    try {
      const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
      invoice.paymentLink = paymentLink.short_url;
      await invoice.save();
    } catch (err) {
      console.error("Failed to create payment link:", err.message);
    }

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update invoice
router.put("/:id", auth, async (req, res) => {
  try {
    const { client, items, taxRate, dueDate, notes, status } = req.body;

    // Calculate totals
    let subtotal = 0;
    const processedItems = items.map((item) => {
      const itemTotal = item.quantity * item.unitPrice - (item.discount || 0);
      subtotal += itemTotal;
      return {
        ...item,
        total: itemTotal,
      };
    });

    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        client,
        items: processedItems,
        subtotal,
        taxRate,
        taxAmount,
        total,
        dueDate,
        notes,
        status,
      },
      { new: true, runValidators: true }
    ).populate("client");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    console.error("Update invoice error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete invoice
router.delete("/:id", auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Bulk upload invoices via CSV
router.post(
  "/bulk-upload",
  auth,
  upload.single("csvFile"),
  async (req, res) => {
    const templateId = parseInt(req.body.templateId) || 1;
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded" });
      }

      const results = {
        successful: 0,
        failed: 0,
        newClients: 0,
        errors: [],
        invoices: [],
      };

      const csvData = [];
      const filePath = req.file.path;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => csvData.push(data))
        .on("end", async () => {
          try {
            const clientGroups = {};

            csvData.forEach((row, index) => {
              const email = row["Client Email"]?.trim();
              if (!email) {
                results.errors.push({
                  row: index + 2,
                  message: "Client email is required",
                });
                return;
              }

              if (!clientGroups[email]) {
                clientGroups[email] = {
                  clientData: {
                    name: row["Client Name"]?.trim(),
                    email: email,
                    phone: row["Client Phone"]?.trim() || "",
                    address: {
                      street: row["Client Street"]?.trim() || "",
                      city: row["Client City"]?.trim() || "",
                      state: row["Client State"]?.trim() || "",
                      pincode: row["Client Pincode"]?.trim() || "",
                      country: "India",
                    },
                    gstin: row["Client GSTIN"]?.trim() || "",
                  },
                  items: [],
                  dueDate: row["Due Date"]?.trim(),
                  notes: row["Notes"]?.trim() || "",
                };
              }

              clientGroups[email].items.push({
                description: row["Item Description"]?.trim(),
                quantity: Number.parseInt(row["Quantity"]) || 1,
                unitPrice: Number.parseFloat(row["Unit Price"]) || 0,
                discount: Number.parseFloat(row["Discount"]) || 0,
              });
            });

            for (const [email, group] of Object.entries(clientGroups)) {
              try {
                let client = await Client.findOne({ email, user: req.userId });
                if (!client) {
                  client = new Client({
                    ...group.clientData,
                    user: req.userId,
                  });
                  await client.save();
                  results.newClients++;
                }

                let subtotal = 0;
                const processedItems = group.items.map((item) => {
                  const itemTotal =
                    item.quantity * item.unitPrice - (item.discount || 0);
                  subtotal += itemTotal;
                  return {
                    ...item,
                    total: itemTotal,
                  };
                });

                const taxRate = 18;
                const taxAmount = (subtotal * taxRate) / 100;
                const total = subtotal + taxAmount;

                const invoice = new Invoice({
                  invoiceNumber: `INV-${Date.now()}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                  templateId,
                  client: client._id,
                  user: req.userId,
                  items: processedItems,
                  subtotal,
                  taxRate,
                  taxAmount,
                  total,
                  dueDate:
                    new Date(group.dueDate) ||
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                  notes: group.notes,
                  status: "pending",
                });

                await invoice.save();
                await invoice.populate("client");

                // 🔗 Generate Razorpay payment link
                try {
                  const paymentLinkOptions = {
                    amount: Math.round(invoice.total * 100),
                    currency: "INR",
                    accept_partial: false,
                    description: `Payment for Invoice ${invoice.invoiceNumber}`,
                    customer: {
                      name: client.name,
                      email: client.email,
                      contact: client.phone || undefined,
                    },
                    notify: {
                      sms: false,
                      email: false,
                    },
                    reminder_enable: true,
                    notes: {
                      invoice_id: invoice._id.toString(),
                      invoice_number: invoice.invoiceNumber,
                    },
                    callback_url: `${process.env.FRONTEND_URL}/invoices/${invoice._id}/payment-success`,
                    callback_method: "get",
                  };

                  const paymentLink = await razorpay.paymentLink.create(
                    paymentLinkOptions
                  );
                  invoice.paymentLink = paymentLink.short_url;
                  await invoice.save();
                } catch (razorErr) {
                  console.error(
                    `Razorpay error for invoice ${invoice._id}:`,
                    razorErr.message
                  );
                  results.errors.push({
                    row: email,
                    message: "Razorpay error: " + razorErr.message,
                  });
                }

                results.invoices.push(invoice);
                results.successful++;
              } catch (error) {
                results.failed++;
                results.errors.push({
                  row: email,
                  message: error.message,
                });
              }
            }

            fs.unlinkSync(filePath);
            res.json(results);
          } catch (error) {
            console.error("CSV processing error:", error);
            res.status(500).json({ message: "Error processing CSV file" });
          }
        });
    } catch (error) {
      console.error("Bulk upload error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Generate PDF for invoice
router.get("/:id/pdf", auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.userId,
    })
      .populate("client")
      .populate({
        path: "user",
        select: "email businessname phone address gstin",
      });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const htmlContent = generateInvoiceHTML(invoice);
    const file = { content: htmlContent };

    const options = {
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    };

    const pdfBuffer = await pdf.generatePdf(file, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
});


// Send invoice via email (SendGrid)
router.post("/:id/send-email", auth, async (req, res) => {
  let browser;
  try {
    const { recipientEmail, subject, message } = req.body;

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.userId,
    })
      .populate("client")
      .populate({
        path: "user",
        select: "email businessname phone address gstin",
      });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Generate PDF
    const htmlContent = generateInvoiceHTML(invoice);
    const file = { content: htmlContent };
    const options = {
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    };
    const pdfBuffer = await pdf.generatePdf(file, options);


    const msg = {
      to: recipientEmail || invoice.client.email,
      from: process.env.FROM_EMAIL,
      subject:
        subject ||
        `Invoice ${invoice.invoiceNumber} from ${invoice.user.businessname}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invoice ${invoice.invoiceNumber}</h2>
          <p>Dear ${invoice.client.name},</p>
          <p>${
            message ||
            "Please find your invoice attached. You can pay securely using the button below."
          }</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${invoice.paymentLink}" target="_blank" style="
              background-color: #3b82f6;
              color: white;
              padding: 12px 20px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
            ">
              Pay Now
            </a>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Invoice Details:</h3>
            <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date(
              invoice.createdAt
            ).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(
              invoice.dueDate
            ).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${invoice.total.toFixed(2)}</p>
            <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
          </div>

          <p>If you have any questions about this invoice, please contact us.</p>
          <p>Best regards,<br>${invoice.user.businessname}</p>
        </div>
      `,
      attachments: [
        {
          content: pdfBuffer.toString("base64"),
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);

    res.json({
      message: "Invoice sent successfully",
      sentTo: recipientEmail || invoice.client.email,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Error sending email: " + error.message });
  } finally {
    if (browser) await browser.close();
  }
});

// Webhook to handle payment status updates
router.post("/payment-webhook", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = require("crypto")
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const { event, payload } = req.body;

    if (event === "payment_link.paid") {
      const paymentLinkId = payload.payment_link.entity.id;
      const invoiceId = payload.payment_link.entity.notes.invoice_id;

      // Update invoice status
      await Invoice.findByIdAndUpdate(invoiceId, {
        status: "paid",
        paidAt: new Date(),
        paymentDetails: {
          paymentId: payload.payment.entity.id,
          paymentLinkId: paymentLinkId,
          amount: payload.payment.entity.amount / 100,
          method: payload.payment.entity.method,
        },
      });
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

module.exports = router;
