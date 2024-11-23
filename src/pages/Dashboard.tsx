import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useFacturaStore } from '../stores/facturaStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const facturas = useFacturaStore(state => state.facturas);
  const currentYear = new Date().getFullYear();

  // Filtrar facturas del año actual
  const facturasDelAnio = facturas.filter(factura => 
    new Date(factura.fecha).getFullYear() === currentYear
  );

  // Calcular ingresos (facturas de venta)
  const ingresosTotales = facturasDelAnio
    .filter(factura => factura.tipo === 'venta')
    .reduce((sum, factura) => {
      const baseImponible = factura.total / 1.21; // Quitar IVA del 21%
      return sum + baseImponible;
    }, 0);

  // Calcular gastos (facturas de compra)
  const gastosTotales = facturasDelAnio
    .filter(factura => factura.tipo === 'compra')
    .reduce((sum, factura) => {
      const baseImponible = factura.total / 1.21; // Quitar IVA del 21%
      return sum + baseImponible;
    }, 0);

  const balance = ingresosTotales - gastosTotales;

  const barData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ingresos',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Gastos',
        data: [8000, 15000, 12000, 18000, 16000, 22000],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const doughnutData = {
    labels: ['Pagadas', 'Pendientes', 'Vencidas'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="content">
      <div className="container-fluid">
        {/* Info boxes */}
        <div className="row">
          <div className="col-12 col-sm-6 col-md-4">
            <div className="info-box">
              <span className="info-box-icon bg-info elevation-1">
                <i className="fas fa-euro-sign"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-text">Ingresos totales</span>
                <span className="info-box-number">€{ingresosTotales.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <div className="info-box mb-3">
              <span className="info-box-icon bg-danger elevation-1">
                <i className="fas fa-shopping-cart"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-text">Gastos totales</span>
                <span className="info-box-number">€{gastosTotales.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <div className="info-box mb-3">
              <span className="info-box-icon bg-success elevation-1">
                <i className="fas fa-balance-scale"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-text">Balance</span>
                <span className="info-box-number">€{balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Ingresos vs Gastos</h3>
              </div>
              <div className="card-body">
                <Bar data={barData} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Estado de Facturas</h3>
              </div>
              <div className="card-body">
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <Doughnut data={doughnutData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Últimas facturas */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Últimas Facturas</h3>
              </div>
              <div className="card-body table-responsive p-0">
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Fecha</th>
                      <th>Cliente/Proveedor</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturas
                      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                      .slice(0, 10)
                      .map(factura => (
                        <tr key={factura.id}>
                          <td>{factura.numero}</td>
                          <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                          <td>{factura.cliente}</td>
                          <td>€{factura.total.toFixed(2)}</td>
                          <td>
                            <span className={`badge bg-${
                              factura.estado === 'pagada' ? 'success' :
                              factura.estado === 'pendiente' ? 'warning' : 'danger'
                            }`}>
                              {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                            </span>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}