import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { useClienteStore } from '../stores/clienteStore';
import ClienteModal from './modals/ClienteModal';
import type { Cliente } from '../stores/clienteStore';

interface ClienteSearchProps {
  onClienteSelect: (cliente: Cliente) => void;
}

export default function ClienteSearch({ onClienteSelect }: ClienteSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const clientes = useClienteStore(state => state.clientes);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      const filtered = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTermLower) ||
        cliente.nif.toLowerCase().includes(searchTermLower)
      );
      setFilteredClientes(filtered);
      setIsOpen(true);
    } else {
      setFilteredClientes([]);
      setIsOpen(false);
    }
  }, [searchTerm, clientes]);

  const handleSelect = (cliente: Cliente) => {
    onClienteSelect(cliente);
    setSearchTerm(cliente.nombre);
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm && filteredClientes.length > 0) {
      handleSelect(filteredClientes[0]);
    }
  };

  const handleNewClienteSuccess = (cliente: Cliente) => {
    setShowModal(false);
    handleSelect(cliente);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <div ref={wrapperRef} className="relative">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar cliente por nombre o NIF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim() && setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          <div className="input-group-append">
            <button 
              type="button"
              className="btn btn-default"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
              title="Nuevo Cliente"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isOpen && filteredClientes.length > 0 && (
          <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg" style={{ zIndex: 1050 }}>
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(cliente)}
                style={{ cursor: 'pointer' }}
              >
                <div className="font-medium">{cliente.nombre}</div>
                <div className="text-sm text-gray-600">{cliente.nif}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClienteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleNewClienteSuccess}
      />
    </>
  );
}