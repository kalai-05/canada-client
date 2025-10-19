import { jsPDF } from "jspdf";
import { WorkOrder } from "@/types/workorder";

export async function generatePDF(workOrder: WorkOrder) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Header with logo and company info
  doc.setFillColor(220, 20, 60); // Crimson red
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("AIRSONIC MECHANICAL INC.", pageWidth / 2, 12, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.text(
    "Residential & Commercial HVAC Services",
    pageWidth / 2,
    20,
    { align: "center" }
  );

  yPos = 35;

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("PMA WORK ORDER", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  // Work Order ID
  doc.setFontSize(11);
  doc.text(`Work Order ID: ${workOrder.workOrderId}`, margin, yPos);
  yPos += 8;

  // Customer Information Section
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Customer Information", margin, yPos);
  yPos += 7;

  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(`Customer ID: ${workOrder.customerId}`, margin + 5, yPos);
  yPos += 5;
  doc.text(`Customer Name: ${workOrder.customerName}`, margin + 5, yPos);
  yPos += 5;
  doc.text(`Address: ${workOrder.address}`, margin + 5, yPos);
  yPos += 8;

  // Service Information
  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("Service Information", margin, yPos);
  yPos += 7;

  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(`Type of PMA: ${workOrder.pmaType}`, margin + 5, yPos);
  yPos += 5;
  doc.text(`Date: ${workOrder.date}`, margin + 5, yPos);
  yPos += 5;
  doc.text(`Overall Condition: ${workOrder.overallCondition}`, margin + 5, yPos);
  yPos += 8;

  // Comments
  if (workOrder.comments) {
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Comments", margin, yPos);
    yPos += 7;

    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    const commentLines = doc.splitTextToSize(workOrder.comments, contentWidth - 5);
    doc.text(commentLines, margin + 5, yPos);
    yPos += commentLines.length * 5 + 3;
  }

  // Recommendations
  if (workOrder.recommendations) {
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Recommendations", margin, yPos);
    yPos += 7;

    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    const recLines = doc.splitTextToSize(
      workOrder.recommendations,
      contentWidth - 5
    );
    doc.text(recLines, margin + 5, yPos);
    yPos += recLines.length * 5 + 3;
  }

  // Status Information
  yPos += 3;
  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("Status", margin, yPos);
  yPos += 7;

  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(
    `Immediate Attention Required: ${workOrder.immediateAttentionRequired ? "YES" : "NO"}`,
    margin + 5,
    yPos
  );
  yPos += 5;
  doc.text(
    `Recommendation to Follow: ${workOrder.recommendationToFollow ? "YES" : "NO"}`,
    margin + 5,
    yPos
  );
  yPos += 8;

  // Materials Table
  if (workOrder.materials.length > 0) {
    yPos += 3;
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Materials / Miscellaneous", margin, yPos);
    yPos += 7;

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);

    const tableData = [
      ["Source", "QTY", "Description", "PO"],
      ...workOrder.materials.map((m) => [
        m.source,
        m.qty.toString(),
        m.description,
        m.po,
      ]),
    ];

    doc.autoTable({
      head: tableData.slice(0, 1),
      body: tableData.slice(1),
      startY: yPos,
      margin: margin,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [220, 20, 60],
        textColor: [255, 255, 255],
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 5;
  }

  // Hours Worked Table
  if (workOrder.hours.length > 0) {
    yPos += 3;
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Hours Worked", margin, yPos);
    yPos += 7;

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);

    const hoursData = [
      ["Date", "Hours", "OT", "RT", "Parking", "Tech", "Initial"],
      ...workOrder.hours.map((h) => [
        h.date,
        h.hours.toString(),
        h.ot.toString(),
        h.rt.toString(),
        h.parking.toString(),
        h.tech,
        h.initial,
      ]),
    ];

    doc.autoTable({
      head: hoursData.slice(0, 1),
      body: hoursData.slice(1),
      startY: yPos,
      margin: margin,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [0, 82, 204],
        textColor: [255, 255, 255],
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 5;
  }

  // Signatures Section
  if (yPos > pageHeight - 50) {
    doc.addPage();
    yPos = margin;
  }

  yPos += 5;
  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("Signatures & Authorization", margin, yPos);
  yPos += 7;

  doc.setFont(undefined, "normal");
  doc.setFontSize(10);

  // Signature lines
  const lineY = yPos + 20;
  const signatureLineLength = 40;

  // Customer Signature
  doc.line(margin + 5, lineY, margin + 5 + signatureLineLength, lineY);
  doc.setFontSize(9);
  doc.text("Customer Signature", margin + 5, lineY + 5);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin + 5, lineY + 10);

  // Technician Signature
  doc.line(
    margin + 60,
    lineY,
    margin + 60 + signatureLineLength,
    lineY
  );
  doc.text("Technician Signature", margin + 60, lineY + 5);
  doc.text(`Tech: ${workOrder.authorizedBy || "_______________"}`, margin + 60, lineY + 10);

  // Footer
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} | Work Order ID: ${workOrder.workOrderId}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`WorkOrder_${workOrder.workOrderId}.pdf`);
}
