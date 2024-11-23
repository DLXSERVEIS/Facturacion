import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Cliente {
  id: string;
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

const clientesData: Cliente[] = [
  {
    id: '1',
    nombre: 'Empresa ABC S.L.',
    nif: 'B12345678',
    email: 'contacto@empresaabc.com',
    telefono: '912345678',
    direccion: 'Calle Principal 123',
    ciudad: 'Madrid',
    codigoPostal: '28001',
  },
  {
    id: '2',
    nombre: 'Comercial XYZ S.A.',
    nif: 'A87654321',
    email: 'info@comercialxyz.com',
    telefono: '934567890',
    direccion: 'Avenida Central 456',
    ciudad: 'Barcelona',
    codigoPostal: '08001',
  },
];

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState(clientesData);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClientes(prevClientes => 
        prevClientes.filter(cliente => cliente.id !== id)
      );
      toast.success('Cliente eliminado correctamente');
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    Object.values(cliente).some(value =>
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
                <h3 className="card-title">Listado de Clientes</h3>
                <div className="card-tools">
                  <Link to="/clientes/nuevo" className="btn btn-primary btn-sm">
                    <i className="fas fa-plus"></i> Nuevo Cliente
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
                        placeholder="Buscar clientes..."
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
                  <table id="clientesTable" className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>NIF</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Ciudad</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClientes.map((cliente) => (
                        <tr key={cliente.id}>
                          <td>{cliente.nombre}</td>
                          <td>{cliente.nif}</td>
                          <td>{cliente.email}</td>
                          <td>{cliente.telefono}</td>
                          <td>{cliente.ciudad}</td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/clientes/${cliente.id}`}
                                className="btn btn-default btn-xs"
                                title="Editar"
                              >
                                <i className="fas fa-pencil-alt"></i>
                              </Link>
                              <button
                                onClick={() => handleDelete(cliente.id)}
                                className="btn btn-danger btn-xs"
                                title="Eliminar"
                              >
                                <i className="fas fa-trash"></i>
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
    </div>
  );
}