import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';
import DataTable from '../../components/DataTable';

interface Proveedor {
  id: string;
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

const proveedoresData: Proveedor[] = [
  {
    id: '1',
    nombre: 'Proveedor ABC S.L.',
    nif: 'B12345678',
    email: 'contacto@proveedorabc.com',
    telefono: '912345678',
    direccion: 'Calle Principal 123',
    ciudad: 'Madrid',
    codigoPostal: '28001',
  },
  {
    id: '2',
    nombre: 'Proveedor XYZ S.A.',
    nif: 'A87654321',
    email: 'info@proveedorxyz.com',
    telefono: '934567890',
    direccion: 'Avenida Central 456',
    ciudad: 'Barcelona',
    codigoPostal: '08001',
  },
];

export default function Proveedores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [proveedores, setProveedores] = useState(proveedoresData);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      setProveedores(prevProveedores => 
        prevProveedores.filter(proveedor => proveedor.id !== id)
      );
      toast.success('Proveedor eliminado correctamente');
    }
  };

  const columns = ['Nombre', 'NIF', 'Email', 'Teléfono', 'Ciudad', 'Acciones'];

  const filteredProveedores = proveedores.filter(proveedor =>
    Object.values(proveedor).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Listado de Proveedores</h3>
                <div className="card-tools">
                  <Link to="/proveedores/nuevo" className="btn btn-primary btn-sm">
                    <i className="fas fa-plus"></i> Nuevo Proveedor
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
                        placeholder="Buscar proveedores..."
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

                <DataTable id="proveedoresTable" columns={columns}>
                  {filteredProveedores.map((proveedor) => (
                    <tr key={proveedor.id}>
                      <td>{proveedor.nombre}</td>
                      <td>{proveedor.nif}</td>
                      <td>{proveedor.email}</td>
                      <td>{proveedor.telefono}</td>
                      <td>{proveedor.ciudad}</td>
                      <td>
                        <div className="btn-group">
                          <Link
                            to={`/proveedores/${proveedor.id}`}
                            className="btn btn-default btn-xs"
                            title="Editar"
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(proveedor.id)}
                            className="btn btn-danger btn-xs"
                            title="Eliminar"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}