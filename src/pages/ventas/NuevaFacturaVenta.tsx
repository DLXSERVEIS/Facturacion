import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ClienteSearch from '../../components/ClienteSearch';
import { useInvoiceNumber } from '../../hooks/useInvoiceNumber';
import { useFacturaStore } from '../../stores/facturaStore';

type FacturaForm = {
  numero: string;
  fecha: string;
  fechaVencimiento: string;
  cliente: {
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    nif: string;
    email: string;
    telefono: string;
  };
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
  }[];
};

export default function NuevaFacturaVenta() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const invoiceNumber = useInvoiceNumber('venta');
  const addFactura = useFacturaStore(state => state.addFactura);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FacturaForm>({
    defaultValues: {
      numero: invoiceNumber,
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

  const handleClienteSelect = (cliente: any) => {
    setValue('cliente.nombre', cliente.nombre, { shouldValidate: true });
    setValue('cliente.nif', cliente.nif, { shouldValidate: true });
    setValue('cliente.direccion', cliente.direccion, { shouldValidate: true });
    setValue('cliente.ciudad', cliente.ciudad, { shouldValidate: true });
    setValue('cliente.codigoPostal', cliente.codigoPostal, { shouldValidate: true });
    setValue('cliente.email', cliente.email, { shouldValidate: true });
    setValue('cliente.telefono', cliente.telefono, { shouldValidate: true });
  };

  const onSubmit = async (data: FacturaForm) => {
    try {
      setIsLoading(true);

      // Preparar los items con los totales calculados
      const itemsConTotales = items.map(item => ({
        descripcion: item.descripcion,
        cantidad: item.cantidad || 0,
        precioUnitario: item.precioUnitario || 0,
        total: (item.cantidad || 0) * (item.precioUnitario || 0)
      }));

      const nuevaFactura = {
        id: crypto.randomUUID(),
        tipo: 'venta' as const,
        numero: data.numero,
        fecha: data.fecha,
        fechaVencimiento: data.fechaVencimiento,
        cliente: data.cliente.nombre,
        nifCliente: data.cliente.nif,
        direccionCliente: data.cliente.direccion,
        ciudadCliente: data.cliente.ciudad,
        cpCliente: data.cliente.codigoPostal,
        emailCliente: data.cliente.email,
        telefonoCliente: data.cliente.telefono,
        items: itemsConTotales,
        subtotal,
        iva,
        total,
        estado: 'pendiente' as const
      };

      addFactura(nuevaFactura);
      toast.success('Factura creada correctamente');
      navigate('/ventas/facturas');
    } catch (error) {
      toast.error('Error al crear la factura');
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
                <h3 className="card-title">Nueva Factura de Venta</h3>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  {/* Datos básicos */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Número de Factura</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('numero')}
                        readOnly
                      />
                    </div>
                    <label className="col-sm-2 col-form-label">Fecha</label>
                    <div className="col-sm-4">
                      <input
                        type="date"
                        className="form-control"
                        {...register('fecha')}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Fecha Vencimiento</label>
                    <div className="col-sm-4">
                      <input
                        type="date"
                        className="form-control"
                        {...register('fechaVencimiento')}
                      />
                    </div>
                  </div>

                  {/* Búsqueda de cliente */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Buscar Cliente</label>
                    <div className="col-sm-10">
                      <ClienteSearch onClienteSelect={handleClienteSelect} />
                    </div>
                  </div>

                  {/* Datos del cliente */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Nombre/Razón Social</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.nombre')}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">NIF/CIF</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.nif')}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Dirección</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.direccion')}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Ciudad</label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.ciudad')}
                        readOnly
                      />
                    </div>
                    <label className="col-sm-2 col-form-label">Código Postal</label>
                    <div className="col-sm-2">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.codigoPostal')}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Líneas de factura */}
                  <div className="form-group">
                    <label>Líneas de Factura</label>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th width="150">Cantidad</th>
                            <th width="150">Precio Unit.</th>
                            <th width="150">Total</th>
                            <th width="50"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field, index) => (
                            <tr key={field.id}>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register(`items.${index}.descripcion`)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  {...register(`items.${index}.cantidad`)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control"
                                  {...register(`items.${index}.precioUnitario`)}
                                />
                              </td>
                              <td className="text-right">
                                €{((items[index]?.cantidad || 0) * (items[index]?.precioUnitario || 0)).toFixed(2)}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => append({ descripcion: '', cantidad: 1, precioUnitario: 0 })}
                    >
                      <i className="fa fa-plus"></i> Añadir línea
                    </button>
                  </div>

                  {/* Totales */}
                  <div className="row">
                    <div className="col-md-4 offset-md-8">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Subtotal:</th>
                            <td className="text-right">€{subtotal.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <th>IVA (21%):</th>
                            <td className="text-right">€{iva.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <th>Total:</th>
                            <td className="text-right"><strong>€{total.toFixed(2)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <Link to="/ventas/facturas" className="btn btn-default">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Factura'}
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