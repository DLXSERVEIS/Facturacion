import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { EmpresaConfig } from '../stores/empresaStore';

interface GeneratePDFOptions {
  factura: any;
  empresaConfig: EmpresaConfig;
}

export const generatePDF = ({ factura, empresaConfig }: GeneratePDFOptions) => {
  const doc = new jsPDF();
  
  // Configuración inicial
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Añadir logo si existe
  if (empresaConfig.logo) {
    doc.addImage(empresaConfig.logo, 'PNG', margin, yPos, 40, 20);
    yPos += 25;
  }

  // Datos de la empresa
  doc.setFontSize(10);
  doc.text(empresaConfig.nombre, pageWidth - margin, yPos, { align: 'right' });
  yPos += 5;
  doc.text(empresaConfig.direccion, pageWidth - margin, yPos, { align: 'right' });
  yPos += 5;
  doc.text(`${empresaConfig.codigoPostal} ${empresaConfig.ciudad}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 5;
  doc.text(`NIF: ${empresaConfig.nif}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 5;
  doc.text(`Tel: ${empresaConfig.telefono}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 5;
  doc.text(empresaConfig.email, pageWidth - margin, yPos, { align: 'right' });
  
  // Número y fecha de factura
  yPos = margin + 40;
  doc.setFontSize(16);
  doc.text(`Factura #${factura.numero}`, margin, yPos);
  yPos += 10;
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString()}`, margin, yPos);
  yPos += 5;
  if (factura.fechaVencimiento) {
    doc.text(`Vencimiento: ${new Date(factura.fechaVencimiento).toLocaleDateString()}`, margin, yPos);
  }

  // Datos del cliente
  yPos += 20;
  doc.setFontSize(12);
  doc.text('Facturar a:', margin, yPos);
  yPos += 7;
  doc.setFontSize(10);
  doc.text(factura.cliente, margin, yPos);
  yPos += 5;
  if (factura.direccionCliente) {
    doc.text(factura.direccionCliente, margin, yPos);
    yPos += 5;
  }
  if (factura.ciudadCliente) {
    doc.text(`${factura.ciudadCliente}${factura.cpCliente ? `, ${factura.cpCliente}` : ''}`, margin, yPos);
    yPos += 5;
  }
  if (factura.nifCliente) {
    doc.text(`NIF: ${factura.nifCliente}`, margin, yPos);
  }

  // Tabla de items
  yPos += 20;
  const tableColumns = [
    { header: 'Descripción', dataKey: 'descripcion' },
    { header: 'Cantidad', dataKey: 'cantidad' },
    { header: 'Precio Unit.', dataKey: 'precioUnitario' },
    { header: 'Total', dataKey: 'total' },
  ];

  const tableRows = factura.items.map((item: any) => ({
    descripcion: item.descripcion,
    cantidad: item.cantidad,
    precioUnitario: `€${item.precioUnitario.toFixed(2)}`,
    total: `€${(item.cantidad * item.precioUnitario).toFixed(2)}`,
  }));

  doc.autoTable({
    startY: yPos,
    head: [tableColumns.map(col => col.header)],
    body: tableRows.map(row => tableColumns.map(col => row[col.dataKey])),
    margin: { left: margin, right: margin },
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Totales
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalesX = pageWidth - margin - 60;
  
  doc.text('Subtotal:', totalesX, finalY);
  doc.text(`€${factura.subtotal.toFixed(2)}`, pageWidth - margin, finalY, { align: 'right' });
  
  doc.text('IVA (21%):', totalesX, finalY + 7);
  doc.text(`€${factura.iva.toFixed(2)}`, pageWidth - margin, finalY + 7, { align: 'right' });
  
  doc.setFontSize(12);
  doc.text('Total:', totalesX, finalY + 15);
  doc.text(`€${factura.total.toFixed(2)}`, pageWidth - margin, finalY + 15, { align: 'right' });

  // Guardar PDF
  doc.save(`Factura-${factura.numero}.pdf`);
};