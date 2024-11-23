import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useFacturaStore } from '../stores/facturaStore';
import { useEmpresaStore } from '../stores/empresaStore';
import { generatePDF } from '../utils/generatePDF';

export default function FacturaDetalle() {
  const { id } = useParams();
  const factura = useFacturaStore(state => state.facturas.find(f => f.id === id));
  const empresaConfig = useEmpresaStore(state => state.config);

  if (!factura) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link
            to="/facturas"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a facturas
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-center text-gray-600">Factura no encontrada</p>
        </div>
      </div>
    );
  }

  const backLink = factura.tipo === 'venta' ? '/ventas/facturas' : '/compras/facturas';

  const handleGeneratePDF = () => {
    if (factura && empresaConfig) {
      generatePDF({ factura, empresaConfig });
    }
  };

  // Asegurar que los valores numéricos sean números
  const formatNumber = (value: any) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to={backLink}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a facturas
        </Link>
        <div className="space-x-2">
          <button 
            onClick={handleGeneratePDF}
            className="inline-flex items-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Cabecera de la factura */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Factura #{factura.numero}
              </h2>
              <p className="text-gray-600">
                Fecha: {new Date(factura.fecha).toLocaleDateString()}
              </p>
              {factura.fechaVencimiento && (
                <p className="text-gray-600">
                  Vencimiento:{' '}
                  {new Date(factura.fechaVencimiento).toLocaleDateString()}
                </p>
              )}
              <p className="text-gray-600">
                Estado: <span className={`badge ${
                  factura.estado === 'pagada' ? 'bg-success' :
                  factura.estado === 'pendiente' ? 'bg-warning' : 'bg-danger'
                }`}>
                  {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                </span>
              </p>
              {factura.fechaPago && (
                <p className="text-gray-600">
                  Fecha de pago: {new Date(factura.fechaPago).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right">
              {empresaConfig.logo && (
                <img 
                  src={empresaConfig.logo} 
                  alt="Logo empresa" 
                  className="h-16 mb-2 ml-auto"
                />
              )}
              <h3 className="text-lg font-semibold">{empresaConfig.nombre}</h3>
              <p className="text-gray-600">{empresaConfig.direccion}</p>
              <p className="text-gray-600">{empresaConfig.codigoPostal} {empresaConfig.ciudad}</p>
              <p className="text-gray-600">NIF: {empresaConfig.nif}</p>
              <p className="text-gray-600">Tel: {empresaConfig.telefono}</p>
              <p className="text-gray-600">{empresaConfig.email}</p>
            </div>
          </div>

          {/* Datos del cliente/proveedor */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {factura.tipo === 'venta' ? 'Cliente' : 'Proveedor'}
            </h3>
            <div className="text-gray-600">
              <p className="font-medium">{factura.cliente}</p>
              <p>{factura.direccionCliente}</p>
              <p>{factura.ciudadCliente}, {factura.cpCliente}</p>
              <p>NIF: {factura.nifCliente}</p>
              <p>Email: {factura.emailCliente}</p>
              <p>Teléfono: {factura.telefonoCliente}</p>
            </div>
          </div>

          {/* Tabla de items */}
          <div className="border-t pt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio unitario
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {factura.items?.map((item, index) => {
                  const cantidad = formatNumber(item.cantidad);
                  const precioUnitario = formatNumber(item.precioUnitario);
                  const total = cantidad * precioUnitario;
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        €{precioUnitario.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        €{total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{formatNumber(factura.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (21%)</span>
                  <span>€{formatNumber(factura.iva).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{formatNumber(factura.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Archivo adjunto (solo para facturas de compra) */}
          {factura.tipo === 'compra' && factura.archivo && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Archivo adjunto</h3>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{factura.archivo.nombre}</span>
                <button className="btn btn-default btn-sm">
                  <i className="fas fa-eye mr-2"></i>
                  Ver archivo
                </button>
                <button className="btn btn-default btn-sm">
                  <i className="fas fa-download mr-2"></i>
                  Descargar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}