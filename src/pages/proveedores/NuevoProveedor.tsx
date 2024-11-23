import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

type ProveedorForm = {
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
};

export default function NuevoProveedor() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProveedorForm>();

  const onSubmit = async (data: ProveedorForm) => {
    try {
      setIsLoading(true);
      console.log(data);
      toast.success('Proveedor creado correctamente');
      navigate('/proveedores');
    } catch (error) {
      toast.error('Error al crear el proveedor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Nuevo Proveedor</h3>
              </div>
              <form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Nombre/Razón Social</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('nombre', { required: 'Este campo es requerido' })}
                      />
                      {errors.nombre && (
                        <span className="error invalid-feedback" style={{ display: 'block' }}>
                          {errors.nombre.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">NIF/CIF</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('nif', { required: 'Este campo es requerido' })}
                      />
                      {errors.nif && (
                        <span className="error invalid-feedback" style={{ display: 'block' }}>
                          {errors.nif.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
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
                        <span className="error invalid-feedback" style={{ display: 'block' }}>
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Teléfono</label>
                    <div className="col-sm-4">
                      <input
                        type="tel"
                        className="form-control"
                        {...register('telefono', { required: 'Este campo es requerido' })}
                      />
                      {errors.telefono && (
                        <span className="error invalid-feedback" style={{ display: 'block' }}>
                          {errors.telefono.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Dirección</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('direccion', { required: 'Este campo es requerido' })}
                      />
                      {errors.direccion && (
                        <span className="error invalid-feedback" style={{ display: 'block' }}>
                          {errors.direccion.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Ciudad</label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        {...register('ciudad', { required: 'Este campo es requerido' })}
                      />
                      {errors.ciudad && (
                        <span className="error invalid-feedback" style={{ display: 'block' }}>
                          {errors.ciudad.message}
                        </span>
                      )}
                    </div>
                    <label className="col-sm-2 col-form-label">Código Postal</label>
                    <div className="col-sm-2">
                      <input
                        type="text"
                        className="form-control"
                        {...register('codigoPostal', { required: 'Este campo es requerido' })}
                      />
                      {errors.codigoPostal && (
                        <span className="error invalid-feedback" style={{ display: 'block' }}>
                          {errors.codigoPostal.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <Link to="/proveedores" className="btn btn-default">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Proveedor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}