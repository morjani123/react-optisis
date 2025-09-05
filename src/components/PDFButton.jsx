import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PDFButton({ ordonnance, clients }) {
  const clientName = clients?.find(c => c.id === ordonnance.clientId)?.firstName + ' ' + clients?.find(c => c.id === ordonnance.clientId)?.lastName;

  const generatePDF = () => {
    const doc = new jsPDF();

    // Logo + Title
    doc.setFontSize(18);
    doc.text("OptiSIS Logo", 14, 20);
    doc.setFontSize(22);
    doc.text("Ordonnance", 105, 20, { align: "center" });

    // Client + Date
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Client: ${clientName || ''}`, 14, 40);
    doc.text(`Date: ${ordonnance.visitDate || ''}`, 14, 48);

    // Table
    autoTable(doc, {
      startY: 60,
      head: [["Œil", "Sph", "Cyl", "Axe", "Add", "Type de correction"]],
      body: [
        ["OD", ordonnance.odSph || '', ordonnance.odCyl || '', ordonnance.odAxis || '', ordonnance.addition || '', ordonnance.correctionType || ''],
        ["OG", ordonnance.ogSph || '', ordonnance.ogCyl || '', ordonnance.ogAxis || '', ordonnance.addition || '', ordonnance.correctionType || ''],
      ],
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text("OptiSIS Group ©", 105, pageHeight - 10, { align: "center" });

    doc.save("ordonnance.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      title="Imprimer Ordonnance"
    >
      🖨️
    </button>
  );
}
