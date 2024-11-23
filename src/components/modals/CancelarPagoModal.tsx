import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DraggableModal from '../DraggableModal';

interface CancelarPagoModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  factura: {
    numero: string;
    fechaPago?: string;
  };
}

export default function CancelarPagoModal({ show, onHide, onConfirm, factura }: CancelarPagoModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      onConfirm();
      toast.success('Pago cancelado correctamente');
      onHide();
    } catch (error) {
      toast.error('Error al cancelar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DraggableModal
      show={show}
      onHide={onHide}
      title="Cancelar Pago de Factura"
    >
      <div className="modal-body">
        <p>¿Estás seguro de que deseas cancelar el pago de la factura <strong>{factura.numero}</strong>?</p>
        {factura.fechaPago && (
          <p>
            <strong>Fecha del pago a cancelar:</strong>{' '}
            {new Date(factura.fechaPago).toLocaleDateString()}
          </p>
        )}
        <p className="text-warning">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Esta acción marcará la factura como pendiente de pago.
        </p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onHide}>
          No, mantener pago
        </button>
        <button
          type="button"
          className="btn btn-warning"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Cancelando...' : 'Sí, cancelar pago'}
        </button>
      </div>
    </DraggableModal>
  );
}