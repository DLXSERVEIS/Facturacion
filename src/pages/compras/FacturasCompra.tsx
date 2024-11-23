import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useFacturaStore } from '../../stores/facturaStore';
import PagoFacturaModal from '../../components/modals/PagoFacturaModal';
import CancelarPagoModal from '../../components/modals/CancelarPagoModal';
import { toast } from 'react-hot-toast';

export default function FacturasCompra() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFactura, setSelectedFactura] = useState<any>(null);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [showCancelarPagoModal, setShowCancelarPagoModal] = useState(false);
  
  const { facturas, updateFactura, deleteFactura, marcarComoPagada, marcarComoPendiente } = useFacturaStore(state => ({
    facturas: state.facturas.filter(f => f.tipo === 'compra'),
    updateFactura: state.updateFactura,
    deleteFactura: state.deleteFactura,
    marcarComoPagada: state.marcarComoPagada,
    marcarComoPendiente: state.marcarComoPendiente
  }));

  const handleDeleteArchivo = (facturaId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar el archivo adjunto?')) {
      const facturaActualizada = {
        ...facturas.find(f => f.id === facturaId)!,
        archivo: undefined
      };
      updateFactura(facturaId, facturaActualizada);
      toast.success('Archivo eliminado correctamente');
    }
  };

  const handleDeleteFactura = (facturaId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta factura? Esta acción no se puede deshacer.')) {
      deleteFactura(facturaId);
      toast.success('Factura eliminada correctamente');
    }
  };

  const handlePago = (factura: any) => {
    setSelectedFactura(factura);
    setShowPagoModal(true);
  };

  const handleConfirmPago = (fechaPago: string) => {
    if (selectedFactura) {
      marcarComoPagada(selectedFactura.id, fechaPago);
      setShowPagoModal(false);
      setSelectedFactura(null);
    }
  };

  const handleCancelarPago = (factura: any) => {
    setSelectedFactura(factura);
    setShowCancelarPagoModal(true);
  };

  const handleConfirmCancelarPago = () => {
    if (selectedFactura) {
      marcarComoPendiente(selectedFactura.id);
      setShowCancelarPagoModal(false);
      setSelectedFactura(null);
    }
  };

  const filteredFacturas = facturas.filter(factura =>
    Object.values(factura).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Listado de Facturas de Compra</h3>
                <div className="card-tools">
                  <Link to="/compras/facturas/nueva" className="btn btn-primary btn-sm">
                    <i className="fas fa-plus"></i> Nueva Factura
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="flex-grow-1 mr-3" style={{ maxWidth: '300px' }}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar facturas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <Search className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Proveedor</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Fecha Pago</th>
                        <th>Archivo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFacturas.map((factura) => (
                        <tr key={factura.id}>
                          <td>{factura.numero}</td>
                          <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                          <td>{factura.cliente}</td>
                          <td>€{factura.total.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${
                              factura.estado === 'pagada' ? 'bg-success' :
                              factura.estado === 'pendiente' ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                            </span>
                          </td>
                          <td>
                            {factura.fechaPago ? 
                              new Date(factura.fechaPago).toLocaleDateString() : 
                              '-'
                            }
                          </td>
                          <td>
                            {factura.archivo ? (
                              <div className="btn-group">
                                <button 
                                  className="btn btn-danger btn-xs" 
                                  title="Eliminar archivo"
                                  onClick={() => handleDeleteArchivo(factura.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="btn-group">
                                <label className="btn btn-default btn-xs">
                                  <i className="fas fa-upload"></i>
                                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg" />
                                </label>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/compras/facturas/${factura.id}`}
                                className="btn btn-default btn-xs"
                                title="Ver detalles"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              {factura.estado === 'pendiente' ? (
                                <button
                                  onClick={() => handlePago(factura)}
                                  className="btn btn-success btn-xs"
                                  title="Marcar como pagada"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              ) : factura.estado === 'pagada' ? (
                                <button
                                  onClick={() => handleCancelarPago(factura)}
                                  className="btn btn-warning btn-xs"
                                  title="Cancelar pago"
                                >
                                  <i className="fas fa-undo"></i>
                                </button>
                              ) : null}
                              <button 
                                className="btn btn-danger btn-xs" 
                                title="Eliminar factura"
                                onClick={() => handleDeleteFactura(factura.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                              <button className="btn btn-default btn-xs" title="Descargar PDF">
                                <i className="fas fa-download"></i>
                              </button>
                            </div>
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

      {selectedFactura && (
        <>
          <PagoFacturaModal
            show={showPagoModal}
            onHide={() => {
              setShowPagoModal(false);
              setSelectedFactura(null);
            }}
            onConfirm={handleConfirmPago}
            factura={selectedFactura}
          />
          <CancelarPagoModal
            show={showCancelarPagoModal}
            onHide={() => {
              setShowCancelarPagoModal(false);
              setSelectedFactura(null);
            }}
            onConfirm={handleConfirmCancelarPago}
            factura={selectedFactura}
          />
        </>
      )}
    </div>
  );
}