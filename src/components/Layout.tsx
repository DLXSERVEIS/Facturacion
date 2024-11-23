import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import ConfiguracionEmpresaModal from './modals/ConfiguracionEmpresaModal';
import { useEmpresaStore } from '../stores/empresaStore';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const empresaConfig = useEmpresaStore(state => state.config);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  useEffect(() => {
    document.body.className = 'hold-transition sidebar-mini layout-fixed';
  }, []);

  return (
    <div className="wrapper">
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light fixed">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button 
              className="nav-link" 
              role="button"
              onClick={() => setShowConfigModal(true)}
              title="Configuración de empresa"
            >
              <i className="fas fa-cog"></i>
            </button>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-widget="fullscreen" href="#" role="button">
              <i className="fas fa-expand-arrows-alt"></i>
            </a>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link" role="button">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
          <span className="brand-text font-weight-light">FACTULEXMA</span>
        </Link>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar Menu */}
          <div className="sidebar-menu-wrapper" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' }}>
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
                <li className="nav-item">
                  <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-tachometer-alt"></i>
                    <p>Dashboard</p>
                  </Link>
                </li>

                <li className="nav-header">COMPRAS</li>
                <li className="nav-item">
                  <Link to="/compras/facturas" className={`nav-link ${isActive('/compras/facturas') ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-file-invoice-dollar"></i>
                    <p>Facturas de Compra</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/proveedores" className={`nav-link ${isActive('/proveedores') ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-truck"></i>
                    <p>Proveedores</p>
                  </Link>
                </li>

                <li className="nav-header">VENTAS</li>
                <li className="nav-item">
                  <Link to="/ventas/facturas" className={`nav-link ${isActive('/ventas/facturas') ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-file-invoice"></i>
                    <p>Facturas de Venta</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/clientes" className={`nav-link ${isActive('/clientes') ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-users"></i>
                    <p>Clientes</p>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* User Panel */}
            <div className="user-panel mt-auto border-top border-secondary">
              <div className="info d-flex align-items-center p-3">
                <div className="image">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.email}&background=random&bold=true&length=0`}
                    className="img-circle elevation-2"
                    alt="User Image"
                    style={{ width: '2.1rem', height: '2.1rem' }}
                  />
                </div>
                <div className="info ml-3">
                  <span className="d-block text-white">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content Wrapper */}
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="main-footer">
        <div className="float-right d-none d-sm-inline">
          Version 1.0.0
        </div>
        <strong>Copyright © 2024 Sistema de Facturas.</strong> Todos los derechos reservados.
      </footer>

      {/* Modal de configuración */}
      <ConfiguracionEmpresaModal
        show={showConfigModal}
        onHide={() => setShowConfigModal(false)}
      />
    </div>
  );
}