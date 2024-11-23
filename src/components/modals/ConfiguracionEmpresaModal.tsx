import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useEmpresaStore } from '../../stores/empresaStore';
import type { EmpresaConfig } from '../../stores/empresaStore';
import DraggableModal from '../DraggableModal';

interface ConfiguracionEmpresaModalProps {
  show: boolean;
  onHide: () => void;
}

export default function ConfiguracionEmpresaModal({
  show,
  onHide,
}: ConfiguracionEmpresaModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { config, updateConfig, setLogo } = useEmpresaStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmpresaConfig>({
    defaultValues: config,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EmpresaConfig) => {
    try {
      setIsLoading(true);
      updateConfig(data);
      toast.success('Configuración actualizada correctamente');
      onHide();
    } catch (error) {
      toast.error('Error al actualizar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DraggableModal
      show={show}
      onHide={onHide}
      title="Configuración de la Empresa"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="modal-body">
          <div className="form-group">
            <label>Logo de la empresa</label>
            <div className="d-flex align-items-center gap-3">
              {config.logo && (
                <img
                  src={config.logo}
                  alt="Logo empresa"
                  className="img-thumbnail"
                  style={{ maxHeight: '100px' }}
                />
              )}
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nombre de la empresa</label>
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

          <div className="row">
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
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
          </div>

          <div className="row">
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
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
            </div>
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
            {isLoading ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}