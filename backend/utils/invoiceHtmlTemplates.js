//Modern Minimalist Template
const template1 = (invoice) => {
  const { client, user } = invoice;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info { flex: 1; }
        .invoice-info { text-align: right; }
        .invoice-title { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .client-info { margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .items-table th { background: #f1f5f9; font-weight: bold; }
        .totals { margin-top: 30px; text-align: right; }
        .totals table { margin-left: auto; border-collapse: collapse; }
        .totals td { padding: 8px 20px; }
        .total-row { font-weight: bold; font-size: 18px; background: #2563eb; color: white; }
        .notes { margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; }
        .footer { margin-top: 50px; text-align: center; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1>${user.businessname}</h1>
          <p>${user.address.street}<br>
          ${user.address.city}, ${user.address.state} - ${
    user.address.pincode
  }<br>
          Phone: ${user.phone}<br>
          Email: ${user.email}</p>
        </div>
        <div class="invoice-info">
          <div class="invoice-title">INVOICE</div>
          <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
          <strong>Date:</strong> ${new Date(
            invoice.createdAt
          ).toLocaleDateString()}<br>
          <strong>Due Date:</strong> ${new Date(
            invoice.dueDate
          ).toLocaleDateString()}</p>
        </div>
      </div>

      <div class="client-info">
        <h3>Bill To:</h3>
        <p><strong>${client.name}</strong><br>
        ${client.address.street}<br>
        ${client.address.city}, ${client.address.state} - ${
    client.address.pincode
  }<br>
        ${client.address.country}<br>
        Phone: ${client.phone}<br>
        Email: ${client.email}
        ${client.gstin ? `<br>GSTIN: ${client.gstin}` : ""}</p>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>₹${item.unitPrice.toFixed(2)}</td>
              <td>₹${(item.discount || 0).toFixed(2)}</td>
              <td>₹${item.total.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>₹${invoice.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Tax (${invoice.taxRate}%):</td>
            <td>₹${invoice.taxAmount.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td>Total:</td>
            <td>₹${invoice.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      ${
        invoice.notes
          ? `
        <div class="notes">
          <h4>Notes:</h4>
          <p>${invoice.notes}</p>
        </div>
      `
          : ""
      }

      <div class="footer">
  <p>SYSTEM GENERATED INVOICE - NO SIGNATURE REQUIRED</p>
  <p>GENERATED ON: ${new Date(invoice.createdAt).toLocaleDateString()}</p>
</div>

    </body>
    </html>
  `;
};

//Professional Corporate Template
const template2 = (invoice) => {
  const { client, user } = invoice;
  return `
<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: 'Times New Roman', serif; 
          margin: 0; 
          padding: 20px; 
          color: #000; 
          background: #fff;
          font-size: 14px;
          line-height: 1.4;
        }
        .page { max-width: 210mm; margin: 0 auto; }
        .header { border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
        .company-info { text-align: center; }
        .company-info h1 { margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase; }
        .invoice-details { display: flex; justify-content: space-between; margin: 20px 0; }
        .invoice-number { font-size: 18px; font-weight: bold; }
        .client-section { margin: 20px 0; }
        .client-box { border: 2px solid #000; padding: 15px; min-width: 250px; }
        .items-table { width: 100%; border: 2px solid #000; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { padding: 8px; border: 1px solid #000; text-align: left; font-size: 12px; }
        .items-table th { background: #000; color: white; font-weight: bold; text-transform: uppercase; }
        .totals-section { margin-top: 20px; }
        .totals-table { float: right; border: 2px solid #000; border-collapse: collapse; clear: both; }
        .totals-table td { padding: 8px 15px; border: 1px solid #000; }
        .total-row { background: #000; color: white; font-weight: bold; }
        .notes-section { clear: both; margin-top: 30px; }
        .notes-box { border: 1px solid #000; padding: 15px; background: #f9f9f9; }
        .footer { margin-top: 30px; text-align: center; border-top: 1px solid #000; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="company-info">
            <h1>${user.businessname}</h1>
            <p>${user.address.street} | ${user.address.city}, ${
    user.address.state
  } - ${user.address.pincode}<br>
            Phone: ${user.phone} | Email: ${user.email}</p>
          </div>
        </div>

        <div class="invoice-details">
          <div>
            <div class="invoice-number">INVOICE #${invoice.invoiceNumber}</div>
            <p><strong>Issue Date:</strong> ${new Date(
              invoice.createdAt
            ).toLocaleDateString()}<br>
            <strong>Due Date:</strong> ${new Date(
              invoice.dueDate
            ).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="client-section">
          <h3>BILL TO:</h3>
          <div class="client-box">
            <strong>${client.name}</strong><br>
            ${client.address.street}<br>
            ${client.address.city}, ${client.address.state} - ${
    client.address.pincode
  }<br>
            ${client.address.country}<br>
            Phone: ${client.phone}<br>
            Email: ${client.email}
            ${client.gstin ? `<br>GSTIN: ${client.gstin}` : ""}
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items
              .map(
                (item) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>₹${item.unitPrice.toFixed(2)}</td>
                <td>₹${(item.discount || 0).toFixed(2)}</td>
                <td>₹${item.total.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals-section">
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td>₹${invoice.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Tax (${invoice.taxRate}%):</td>
              <td>₹${invoice.taxAmount.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>TOTAL:</td>
              <td>₹${invoice.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${
          invoice.notes
            ? `
          <div class="notes-section">
            <h4>NOTES:</h4>
            <div class="notes-box">
              <p>${invoice.notes}</p>
            </div>
          </div>
        `
            : ""
        }

        <div class="footer">
  <p>SYSTEM GENERATED INVOICE - NO SIGNATURE REQUIRED</p>
  <p>GENERATED ON: ${new Date(invoice.createdAt).toLocaleDateString()}</p>
</div>

      </div>
    </body>
    </html>`;
};

//Vibrant Gradient Template 
const template3 = (invoice) => {
  const { client, user } = invoice;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    .invoice-container {
      width: 21cm;
      min-height: 29.7cm;
      padding: 1.5cm;
      box-sizing: border-box;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      margin: auto;
    }

    .header {
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      color: white;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 300;
    }

    .invoice-title {
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .content {
      padding: 20px 0;
    }

    .info-section {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 20px;
    }

    .company-info, .invoice-info {
      flex: 1;
      font-size: 12px;
    }

    .invoice-info {
      text-align: right;
    }

    .client-info {
      background: linear-gradient(135deg, #a8edea, #fed6e3);
      padding: 15px;
      border-radius: 10px;
      margin: 15px 0;
      border-left: 5px solid #ff6b6b;
      font-size: 12px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
    }

    .items-table th {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 10px;
      text-align: left;
      font-weight: 600;
    }

    .items-table td {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
    }

    .items-table tr:nth-child(even) {
      background: #f8f9ff;
    }

    .totals {
      margin-top: 20px;
      text-align: right;
    }

    .totals-card {
      background: linear-gradient(135deg, #ffeaa7, #fab1a0);
      display: inline-block;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      font-size: 14px;
    }

    .total-row {
      font-size: 16px;
      font-weight: bold;
      color: #2d3436;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid #636e72;
    }

    .notes {
      margin-top: 20px;
      background: linear-gradient(135deg, #fdcb6e, #e17055);
      padding: 15px;
      border-radius: 10px;
      color: white;
      font-size: 12px;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      padding: 10px;
      background: linear-gradient(135deg, #74b9ff, #0984e3);
      color: white;
      border-radius: 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>${user.businessname}</h1>
      <div class="invoice-title">INVOICE</div>
    </div>
    
    <div class="content">
      <div class="info-section">
        <div class="company-info">
          <p>${user.address.street}<br>
          ${user.address.city}, ${user.address.state} - ${
    user.address.pincode
  }<br>
          Phone: ${user.phone}<br>
          Email: ${user.email}</p>
        </div>
        <div class="invoice-info">
          <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
          <strong>Date:</strong> ${new Date(
            invoice.createdAt
          ).toLocaleDateString()}<br>
          <strong>Due Date:</strong> ${new Date(
            invoice.dueDate
          ).toLocaleDateString()}</p>
        </div>
      </div>

      <div class="client-info">
        <h3>💼 Bill To:</h3>
        <p><strong>${client.name}</strong><br>
        ${client.address.street}<br>
        ${client.address.city}, ${client.address.state} - ${
    client.address.pincode
  }<br>
        ${client.address.country}<br>
        📞 ${client.phone}<br>
        📧 ${client.email}
        ${client.gstin ? `<br>🏢 GSTIN: ${client.gstin}` : ""}</p>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>₹${item.unitPrice.toFixed(2)}</td>
              <td>₹${(item.discount || 0).toFixed(2)}</td>
              <td>₹${item.total.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-card">
          <div>Subtotal: ₹${invoice.subtotal.toFixed(2)}</div>
          <div>Tax (${invoice.taxRate}%): ₹${invoice.taxAmount.toFixed(2)}</div>
          <div class="total-row">Total: ₹${invoice.total.toFixed(2)}</div>
        </div>
      </div>

      ${
        invoice.notes
          ? `
        <div class="notes">
          <h4>📝 Notes:</h4>
          <p>${invoice.notes}</p>
        </div>
      `
          : ""
      }

      <div class="footer">
  <p>SYSTEM GENERATED INVOICE - NO SIGNATURE REQUIRED</p>
  <p>GENERATED ON: ${new Date(invoice.createdAt).toLocaleDateString()}</p>
</div>

    </div>
  </div>
</body>
</html>
`;
};

//Simple clean Template
const template4 = (invoice) => {
  const { client, user } = invoice;
  return ` <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 25px; 
          color: #333; 
          line-height: 1.6; 
          font-size: 14px;
        }
        .invoice-container { max-width: 210mm; margin: 0 auto; }
        .header { margin-bottom: 25px; }
        .company-name { font-size: 20px; font-weight: 600; color: #2c3e50; margin-bottom: 5px; }
        .invoice-title { font-size: 24px; font-weight: 300; color: #7f8c8d; margin: 15px 0; }
        .info-section { display: flex; justify-content: space-between; margin-bottom: 25px; }
        .company-details, .invoice-details { flex: 1; }
        .invoice-details { text-align: right; }
        .client-section { margin-bottom: 25px; }
        .client-title { 
          font-size: 12px; 
          font-weight: 600; 
          color: #7f8c8d; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
          margin-bottom: 8px; 
        }
        .client-details { font-size: 14px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
        .items-table th { 
          background: #ecf0f1; 
          padding: 10px; 
          text-align: left; 
          font-weight: 600; 
          color: #2c3e50; 
          border-bottom: 2px solid #bdc3c7; 
        }
        .items-table td { padding: 10px; border-bottom: 1px solid #ecf0f1; }
        .totals { margin-top: 25px; text-align: right; }
        .totals-table { margin-left: auto; }
        .totals-table td { padding: 6px 0; }
        .total-row { 
          font-size: 16px; 
          font-weight: 600; 
          color: #2c3e50; 
          border-top: 2px solid #2c3e50; 
          padding-top: 8px; 
        }
        .notes { 
          margin-top: 25px; 
          padding: 15px; 
          background: #f8f9fa; 
          border-left: 4px solid #3498db; 
        }
        .notes h4 { margin-top: 0; color: #2c3e50; }
        .footer { margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-name">${user.businessname}</div>
          <div class="invoice-title">Invoice</div>
        </div>

        <div class="info-section">
          <div class="company-details">
            <p>${user.address.street}<br>
            ${user.address.city}, ${user.address.state} - ${
    user.address.pincode
  }<br>
            Phone: ${user.phone}<br>
            Email: ${user.email}</p>
          </div>
          <div class="invoice-details">
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
            <strong>Date:</strong> ${new Date(
              invoice.createdAt
            ).toLocaleDateString()}<br>
            <strong>Due Date:</strong> ${new Date(
              invoice.dueDate
            ).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="client-section">
          <div class="client-title">Bill To</div>
          <div class="client-details">
            <strong>${client.name}</strong><br>
            ${client.address.street}<br>
            ${client.address.city}, ${client.address.state} - ${
    client.address.pincode
  }<br>
            ${client.address.country}<br>
            Phone: ${client.phone}<br>
            Email: ${client.email}
            ${client.gstin ? `<br>GSTIN: ${client.gstin}` : ""}
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items
              .map(
                (item) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>₹${item.unitPrice.toFixed(2)}</td>
                <td>₹${(item.discount || 0).toFixed(2)}</td>
                <td>₹${item.total.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td style="padding-left: 30px;">₹${invoice.subtotal.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td>Tax (${invoice.taxRate}%):</td>
              <td style="padding-left: 30px;">₹${invoice.taxAmount.toFixed(
                2
              )}</td>
            </tr>
            <tr class="total-row">
              <td>Total:</td>
              <td style="padding-left: 30px;">₹${invoice.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${
          invoice.notes
            ? `
          <div class="notes">
            <h4>Notes:</h4>
            <p>${invoice.notes}</p>
          </div>
        `
            : ""
        }

        <div class="footer">
          <p>SYSTEM GENERATED INVOICE - NO SIGNATURE REQUIRED</p>
          <p>GENERATED ON: ${new Date(
            invoice.createdAt
          ).toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>`;
};

//Typewriter Retro Template
const template5 = (invoice) => {
  const { client, user } = invoice;
  return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { 
      font-family: 'Courier New', monospace; 
      color: #333; 
      background: #fff; 
      padding: 40px; 
      text-align: center; 
      font-size: 13px;
      line-height: 1.5;
    }
    h1 { font-size: 24px; margin-bottom: 20px; letter-spacing: 1px; color: #2c3e50; }
    .details, .totals, .notes { margin: 25px auto; max-width: 700px; text-align: left; }
    .details div { margin-bottom: 6px; }
    .address-block { 
      margin: 10px 0; 
      padding: 0; 
      display: inline-block;
      width: 48%;
      vertical-align: top;
    }
    .address-title { 
      font-weight: bold; 
      font-size: 13px; 
      margin-bottom: 8px; 
      color: #333;
    }
    .address-content { font-size: 12px; line-height: 1.4; color: #555; }
    .address-row { display: flex; gap: 2%; justify-content: space-between; margin: 15px 0; }
    .section-divider { 
      margin: 20px 0; 
      border-top: 2px dashed #666; 
      height: 1px; 
    }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
    th { background: #f8f9fa; font-weight: bold; text-align: center; color: #2c3e50; }
    td { text-align: center; }
    td:first-child { text-align: left; }
    .totals td { border: none; padding: 6px 0; text-align: right; font-size: 13px; }
    .total-line { 
      font-weight: bold; 
      font-size: 16px; 
      border-top: 1px solid #333; 
      padding-top: 8px; 
    }
    .notes { 
      border: 1px dashed #666; 
      padding: 15px; 
      background: #f5f5f5; 
      margin-top: 25px; 
    }
    .footer { 
      margin-top: 50px; 
      font-size: 11px; 
      color: #555; 
      border-top: 2px dashed #aaa; 
      padding-top: 15px; 
    }
  </style>
</head>
<body>
  <h1>INVOICE</h1>

  <div class="details">
    <div><strong>INVOICE NUMBER: </strong>${invoice.invoiceNumber}</div>
    <div><strong>DATE ISSUED: </strong>${new Date(
      invoice.createdAt
    ).toLocaleDateString()}</div>
    <div><strong>DUE DATE: </strong>${new Date(
      invoice.dueDate
    ).toLocaleDateString()}</div>
    
    <div class="section-divider"></div>
    
    <div class="address-row">
      <div class="address-block">
        <div class="address-title">From:</div>
        <div class="address-content">
          <strong>${user.businessname}</strong><br>
          ${user.address.street}<br>
          ${user.address.city}, ${user.address.state} ${
    user.address.pincode
  }<br>
          ${user.phone}<br>
          ${user.email}
          ${user.gstin ? `<br>GSTIN: ${user.gstin}` : ""}
        </div>
      </div>
      
      <div class="address-block">
        <div class="address-title">Bill To:</div>
        <div class="address-content">
          <strong>${client.name}</strong><br>
          ${client.address.street}<br>
          ${client.address.city}, ${client.address.state} ${
    client.address.pincode
  }<br>
          ${client.address.country}<br>
          ${client.phone}<br>
          ${client.email}
          ${client.gstin ? `<br>GSTIN: ${client.gstin}` : ""}
        </div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>DESCRIPTION</th>
        <th>QTY</th>
        <th>UNIT PRICE</th>
        <th>DISCOUNT</th>
        <th>TOTAL</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items
        .map(
          (item) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>₹${item.unitPrice.toFixed(2)}</td>
          <td>₹${(item.discount || 0).toFixed(2)}</td>
          <td>₹${item.total.toFixed(2)}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>SUBTOTAL:</td><td>₹${invoice.subtotal.toFixed(2)}</td></tr>
      <tr><td>TAX (${invoice.taxRate}%):</td><td>₹${invoice.taxAmount.toFixed(
    2
  )}</td></tr>
      <tr class="total-line"><td>TOTAL AMOUNT:</td><td>₹${invoice.total.toFixed(
        2
      )}</td></tr>
    </table>
  </div>

  ${
    invoice.notes
      ? `
    <div class="notes">
      <strong>NOTES:</strong><br>
      ${invoice.notes}
    </div>
  `
      : ""
  }

  <div class="footer">
  <p>SYSTEM GENERATED INVOICE - NO SIGNATURE REQUIRED</p>
  <p>GENERATED ON: ${new Date(invoice.createdAt).toLocaleDateString()}</p>
</div>

</body>
</html>
`;
};

module.exports = { template1, template2, template3, template4, template5 };
