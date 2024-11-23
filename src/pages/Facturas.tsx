import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Factura {
  id: string;
  tipo: 'compra' | 'venta';
  numero: string;
  fecha: string;
  cliente: string;
  total: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
}

const facturas: Factura[] = [
  {
    id: '1',
    tipo: 'venta',
    numero: 'FAC-001',
    fecha: '2024-03-01',
    cliente: 'Empresa ABC',
    total: 1500.00,
    estado: 'pagada',
  },
  {
    id: '2',
    tipo: 'compra',
    numero: 'FAC-002',
    fecha: '2024-03-05',
    cliente: 'Empresa XYZ',
    total: 2300.00,
    estado: 'pendiente',
  },
];

export default function Facturas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFactura, setTipoFactura] = useState<'todas' | 'compra' | 'venta'>(
    'todas'
  );
  const navigate = useNavigate();

  const getEstadoColor = (estado: Factura['estado']) => {
    switch (estado) {
      case 'pagada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'vencida':
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredFacturas = facturas.filter((factura) => {
    const matchesSearch =
      factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo =
      tipoFactura === 'todas' || factura.tipo === tipoFactura;
    return matchesSearch && matchesTipo;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Facturas</h1>
        <button
          onClick={() => navigate('/facturas/nueva')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar facturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={tipoFactura}
              onChange={(e) =>
                setTipoFactura(e.target.value as 'todas' | 'compra' | 'venta')
              }
              className="px-4 py-2 border rounded-md text-gray-700"
            >
              <option value="todas">Todas las facturas</option>
              <option value="venta">Facturas de venta</option>
              <option value="compra">Facturas de compra</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Más filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente/Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFacturas.map((factura) => (
                <tr
                  key={factura.id}
                  onClick={() => navigate(`/facturas/${factura.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        factura.tipo === 'venta'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {factura.tipo === 'venta' ? 'Venta' : 'Compra'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {factura.numero}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(factura.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {factura.cliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    €{factura.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
                        factura.estado
                      )}`}
                    >
                      {factura.estado.charAt(0).toUpperCase() +
                        factura.estado.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}