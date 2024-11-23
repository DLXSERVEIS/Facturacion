import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FacturasVenta from './pages/ventas/FacturasVenta';
import FacturasCompra from './pages/compras/FacturasCompra';
import NuevaFacturaVenta from './pages/ventas/NuevaFacturaVenta';
import NuevaFacturaCompra from './pages/compras/NuevaFacturaCompra';
import Login from './pages/Login';
import Register from './pages/Register';
import FacturaDetalle from './pages/FacturaDetalle';
import Clientes from './pages/clientes/Clientes';
import NuevoCliente from './pages/clientes/NuevoCliente';
import EditarCliente from './pages/clientes/EditarCliente';
import Proveedores from './pages/proveedores/Proveedores';
import NuevoProveedor from './pages/proveedores/NuevoProveedor';
import EditarProveedor from './pages/proveedores/EditarProveedor';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="ventas/facturas" element={<FacturasVenta />} />
              <Route path="ventas/facturas/nueva" element={<NuevaFacturaVenta />} />
              <Route path="ventas/facturas/:id" element={<FacturaDetalle />} />
              <Route path="compras/facturas" element={<FacturasCompra />} />
              <Route path="compras/facturas/nueva" element={<NuevaFacturaCompra />} />
              <Route path="compras/facturas/:id" element={<FacturaDetalle />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="clientes/nuevo" element={<NuevoCliente />} />
              <Route path="clientes/:id" element={<EditarCliente />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="proveedores/nuevo" element={<NuevoProveedor />} />
              <Route path="proveedores/:id" element={<EditarProveedor />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;