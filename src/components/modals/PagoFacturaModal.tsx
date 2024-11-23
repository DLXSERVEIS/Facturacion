import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import DraggableModal from '../DraggableModal';

interface PagoFacturaModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (fechaPago: string) => void;
  factura: {
    numero: string;
    total: number;
  };
}

type PagoForm = {
  fechaPago: string;
};

export default function PagoFacturaModal({ show, onHide, onConfirm, factura }: PagoFacturaModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PagoForm>({
    defaultValues: {
      fechaPago: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: PagoForm) => {
    try {
      setIsLoading(true);
      onConfirm(data.fechaPago);
      onHide();
    } catch (error) {
      toast.error('Error al registrar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DraggableModal
      show={show}
      onHide={onHide}
      title="Registrar Pago de Factura"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="modal-body">
          <p>
            <strong>Factura:</strong> {factura.numero}<br />
            <strong>Importe:</strong> €{factura.total.toFixed(2)}
          </p>
          <div className="form-group">
            <label>Fecha de Pago</label>
            <input
              type="date"
              className="form-control"
              {...register('fechaPago', { required: 'Este campo es requerido' })}
            />
            {errors.fechaPago && (
              <span className="text-danger">{errors.fechaPago.message}</span>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Confirmar Pago'}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}