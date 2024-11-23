import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useClienteStore } from '../../stores/clienteStore';
import DraggableModal from '../DraggableModal';

interface ClienteModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: (cliente: any) => void;
}

type ClienteForm = {
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
};

export default function ClienteModal({ show, onHide, onSuccess }: ClienteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const addCliente = useClienteStore(state => state.addCliente);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteForm>();

  const onSubmit = async (data: ClienteForm) => {
    try {
      setIsLoading(true);
      const nuevoCliente = {
        id: crypto.randomUUID(),
        ...data
      };
      
      addCliente(nuevoCliente);
      toast.success('Cliente creado correctamente');
      reset();
      onSuccess(nuevoCliente);
    } catch (error) {
      toast.error('Error al crear el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DraggableModal
      show={show}
      onHide={onHide}
      title="Nuevo Cliente"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="modal-body">
          <div className="form-group">
            <label>Nombre/Razón Social</label>
            <input
              type="text"
              className="form-control"
              {...register('nombre', { required: 'Este campo es requerido' })}
            />
            {errors.nombre && (
              <span className="text-danger">{errors.nombre.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>NIF/CIF</label>
            <input
              type="text"
              className="form-control"
              {...register('nif', { required: 'Este campo es requerido' })}
            />
            {errors.nif && (
              <span className="text-danger">{errors.nif.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              {...register('email', {
                required: 'Este campo es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              className="form-control"
              {...register('telefono', { required: 'Este campo es requerido' })}
            />
            {errors.telefono && (
              <span className="text-danger">{errors.telefono.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              className="form-control"
              {...register('direccion', { required: 'Este campo es requerido' })}
            />
            {errors.direccion && (
              <span className="text-danger">{errors.direccion.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Ciudad</label>
            <input
              type="text"
              className="form-control"
              {...register('ciudad', { required: 'Este campo es requerido' })}
            />
            {errors.ciudad && (
              <span className="text-danger">{errors.ciudad.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Código Postal</label>
            <input
              type="text"
              className="form-control"
              {...register('codigoPostal', { required: 'Este campo es requerido' })}
            />
            {errors.codigoPostal && (
              <span className="text-danger">{errors.codigoPostal.message}</span>
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
            {isLoading ? 'Guardando...' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}