import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

type FacturaForm = {
  tipo: 'compra' | 'venta';
  numero: string;
  fecha: string;
  fechaVencimiento: string;
  cliente: {
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    nif: string;
  };
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
  }[];
};

export default function NuevaFactura() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FacturaForm>({
    defaultValues: {
      tipo: 'venta',
      fecha: new Date().toISOString().split('T')[0],
      items: [{ descripcion: '', cantidad: 1, precioUnitario: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const subtotal = items?.reduce(
    (sum, item) => sum + (item.cantidad || 0) * (item.precioUnitario || 0),
    0
  );
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const onSubmit = async (data: FacturaForm) => {
    try {
      setIsLoading(true);
      // Aquí iría la lógica para guardar la factura
      console.log(data);
      toast.success('Factura creada correctamente');
      navigate('/facturas');
    } catch (error) {
      toast.error('Error al crear la factura');
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Nueva Factura</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Tipo de factura y datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Factura
              </label>
              <select
                {...register('tipo')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="venta">Factura de Venta</option>
                <option value="compra">Factura de Compra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Factura
              </label>
              <input
                type="text"
                {...register('numero', { required: 'Campo requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.numero && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.numero.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                {...register('fecha', { required: 'Campo requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Vencimiento
              </label>
              <input
                type="date"
                {...register('fechaVencimiento', { required: 'Campo requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Datos del cliente/proveedor */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Datos del {watch('tipo') === 'venta' ? 'Cliente' : 'Proveedor'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre/Razón Social
                </label>
                <input
                  type="text"
                  {...register('cliente.nombre', { required: 'Campo requerido' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIF/CIF
                </label>
                <input
                  type="text"
                  {...register('cliente.nif', { required: 'Campo requerido' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  {...register('cliente.direccion', {
                    required: 'Campo requerido',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    {...register('cliente.ciudad', {
                      required: 'Campo requerido',
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    {...register('cliente.codigoPostal', {
                      required: 'Campo requerido',
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Líneas de factura */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Líneas de Factura
            </h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Descripción"
                      {...register(`items.${index}.descripcion` as const, {
                        required: 'Campo requerido',
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Cantidad"
                      {...register(`items.${index}.cantidad` as const, {
                        required: 'Campo requerido',
                        min: { value: 1, message: 'Mínimo 1' },
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Precio"
                      {...register(`items.${index}.precioUnitario` as const, {
                        required: 'Campo requerido',
                        min: { value: 0, message: 'Debe ser positivo' },
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-32 pt-1">
                    <p className="text-sm text-gray-600">
                      €
                      {(
                        (items[index]?.cantidad || 0) *
                        (items[index]?.precioUnitario || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-1 p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  append({ descripcion: '', cantidad: 1, precioUnitario: 0 })
                }
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir línea
              </button>
            </div>
          </div>

          {/* Totales */}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>IVA (21%)</span>
                  <span>€{iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            to="/facturas"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar Factura'}
          </button>
        </div>
      </form>
    </div>
  );
}