import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type ClienteForm = {
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
};

export default function EditarCliente() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClienteForm>();

  useEffect(() => {
    // Aquí cargaríamos los datos del cliente
    // Ejemplo de datos precargados
    reset({
      nombre: 'Empresa ABC S.L.',
      nif: 'B12345678',
      email: 'contacto@empresaabc.com',
      telefono: '912345678',
      direccion: 'Calle Principal 123',
      ciudad: 'Madrid',
      codigoPostal: '28001',
    });
  }, [id, reset]);

  const onSubmit = async (data: ClienteForm) => {
    try {
      setIsLoading(true);
      // Aquí iría la lógica para actualizar el cliente
      console.log(data);
      toast.success('Cliente actualizado correctamente');
      navigate('/clientes');
    } catch (error) {
      toast.error('Error al actualizar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to="/clientes"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a clientes
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Editar Cliente</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre/Razón Social
              </label>
              <input
                type="text"
                {...register('nombre', { required: 'Este campo es requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                NIF/CIF
              </label>
              <input
                type="text"
                {...register('nif', { required: 'Este campo es requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.nif && (
                <p className="mt-1 text-sm text-red-600">{errors.nif.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Este campo es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="tel"
                {...register('telefono', { required: 'Este campo es requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                {...register('direccion', { required: 'Este campo es requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.direccion.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ciudad
              </label>
              <input
                type="text"
                {...register('ciudad', { required: 'Este campo es requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.ciudad && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ciudad.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código Postal
              </label>
              <input
                type="text"
                {...register('codigoPostal', {
                  required: 'Este campo es requerido',
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.codigoPostal && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.codigoPostal.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/clientes"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Actualizar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}