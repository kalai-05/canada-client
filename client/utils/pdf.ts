import { WorkOrder } from "@/types/workorder";

export async function generatePDF(workOrder: WorkOrder) {
  // Create HTML content for printing as PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Work Order ${workOrder.workOrderId}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          font-size: 12px;
          line-height: 1.5;
        }
        .header {
          background: linear-gradient(135deg, #dc143c 0%, #1e40af 100%);
          color: white;
          padding: 20px;
          text-align: center;
          margin: -20px -20px 20px -20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0 0;
          font-size: 12px;
        }
        .section {
          margin-bottom: 20px;
          border: 1px solid #ddd;
          padding: 10px;
        }
        .section h2 {
          margin: 0 0 10px 0;
          font-size: 14px;
          background: #f0f0f0;
          padding: 5px;
          border-left: 4px solid #dc143c;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .form-group {
          margin-bottom: 8px;
        }
        .label {
          font-weight: bold;
          color: #333;
          font-size: 11px;
          text-transform: uppercase;
        }
        .value {
          color: #666;
          margin-top: 2px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          background: #dc143c;
          color: white;
          padding: 8px;
          text-align: left;
          font-size: 11px;
          border: 1px solid #ddd;
        }
        td {
          padding: 8px;
          border: 1px solid #ddd;
          font-size: 11px;
        }
        .checkbox {
          display: inline-block;
          margin-right: 10px;
        }
        .status-yes {
          color: #dc143c;
          font-weight: bold;
        }
        .status-no {
          color: #666;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 10px;
          text-align: center;
          color: #999;
        }
        .signature-section {
          margin-top: 30px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .signature-line {
          text-align: center;
        }
        .line {
          border-bottom: 1px solid #000;
          margin: 30px 0 5px 0;
        }
        .label-small {
          font-size: 10px;
          margin-top: 5px;
        }
        @media print {
          body { margin: 0; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔴 AIRSONIC 🔵 MECHANICAL INC.</h1>
        <p>Residential & Commercial HVAC Services</p>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px;">PMA WORK ORDER</h2>
        <p style="margin: 5px 0;">Work Order ID: <strong>${workOrder.workOrderId}</strong></p>
      </div>

      <div class="section">
        <h2>Customer Information</h2>
        <div class="grid">
          <div class="form-group">
            <div class="label">Customer ID</div>
            <div class="value">${workOrder.customerId}</div>
          </div>
          <div class="form-group">
            <div class="label">Customer Name</div>
            <div class="value">${workOrder.customerName}</div>
          </div>
          <div class="form-group" style="grid-column: 1/-1;">
            <div class="label">Address</div>
            <div class="value">${workOrder.address}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Service Information</h2>
        <div class="grid">
          <div class="form-group">
            <div class="label">Type of PMA</div>
            <div class="value">${workOrder.pmaType}</div>
          </div>
          <div class="form-group">
            <div class="label">Date</div>
            <div class="value">${workOrder.date}</div>
          </div>
          <div class="form-group">
            <div class="label">Overall Condition</div>
            <div class="value">${workOrder.overallCondition}</div>
          </div>
          <div class="form-group">
            <div class="label">Indoor Air Quality</div>
            <div class="value">${workOrder.indoorAirQuality}</div>
          </div>
        </div>
      </div>

      ${workOrder.comments ? `
      <div class="section">
        <h2>Comments</h2>
        <div class="value" style="white-space: pre-wrap;">${workOrder.comments}</div>
      </div>
      ` : ''}

      ${workOrder.recommendations ? `
      <div class="section">
        <h2>Recommendations</h2>
        <div class="value" style="white-space: pre-wrap;">${workOrder.recommendations}</div>
      </div>
      ` : ''}

      <div class="section">
        <h2>Status</h2>
        <div class="grid">
          <div class="form-group">
            <div class="label">Immediate Attention Required</div>
            <div class="value ${workOrder.immediateAttentionRequired ? 'status-yes' : 'status-no'}">
              ${workOrder.immediateAttentionRequired ? 'YES' : 'NO'}
            </div>
          </div>
          <div class="form-group">
            <div class="label">Recommendation to Follow</div>
            <div class="value ${workOrder.recommendationToFollow ? 'status-yes' : 'status-no'}">
              ${workOrder.recommendationToFollow ? 'YES' : 'NO'}
            </div>
          </div>
        </div>
      </div>

      ${workOrder.materials.length > 0 ? `
      <div class="section">
        <h2>Materials / Miscellaneous</h2>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>QTY</th>
              <th>Description</th>
              <th>PO</th>
            </tr>
          </thead>
          <tbody>
            ${workOrder.materials.map(m => `
              <tr>
                <td>${m.source}</td>
                <td>${m.qty}</td>
                <td>${m.description}</td>
                <td>${m.po}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${workOrder.hours.length > 0 ? `
      <div class="section">
        <h2>Hours Worked</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Hours</th>
              <th>OT</th>
              <th>RT</th>
              <th>Parking</th>
              <th>Tech</th>
              <th>Initial</th>
            </tr>
          </thead>
          <tbody>
            ${workOrder.hours.map(h => `
              <tr>
                <td>${h.date}</td>
                <td>${h.hours}</td>
                <td>${h.ot}</td>
                <td>${h.rt}</td>
                <td>${h.parking}</td>
                <td>${h.tech}</td>
                <td>${h.initial}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="signature-section">
        <div class="signature-line">
          <div class="line"></div>
          <div class="label-small">Customer Signature</div>
          <div class="label-small">Date: ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="signature-line">
          <div class="line"></div>
          <div class="label-small">Technician Signature</div>
          <div class="label-small">Tech: ${workOrder.authorizedBy || '_______________'}</div>
        </div>
      </div>

      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} | Work Order ID: ${workOrder.workOrderId}</p>
        <p>Airsonic Mechanical Inc. | Residential & Commercial HVAC Services</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window/tab for printing
  const printWindow = window.open("", "", "height=600,width=800");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for the document to load before printing
    setTimeout(() => {
      printWindow.print();
      // Optionally close the window after printing
      printWindow.close();
    }, 250);
  }
}
