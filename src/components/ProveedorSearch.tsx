import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { useProveedorStore } from '../stores/proveedorStore';
import ProveedorModal from './modals/ProveedorModal';
import type { Proveedor } from '../stores/proveedorStore';

interface ProveedorSearchProps {
  onProveedorSelect: (proveedor: Proveedor) => void;
}

export default function ProveedorSearch({ onProveedorSelect }: ProveedorSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const proveedores = useProveedorStore(state => state.proveedores);
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([]);

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
      const filtered = proveedores.filter(proveedor =>
        proveedor.nombre.toLowerCase().includes(searchTermLower) ||
        proveedor.nif.toLowerCase().includes(searchTermLower)
      );
      setFilteredProveedores(filtered);
      setIsOpen(true);
    } else {
      setFilteredProveedores([]);
      setIsOpen(false);
    }
  }, [searchTerm, proveedores]);

  const handleSelect = (proveedor: Proveedor) => {
    onProveedorSelect(proveedor);
    setSearchTerm(proveedor.nombre);
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm && filteredProveedores.length > 0) {
      handleSelect(filteredProveedores[0]);
    }
  };

  const handleNewProveedorSuccess = (proveedor: Proveedor) => {
    setShowModal(false);
    handleSelect(proveedor);
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
            placeholder="Buscar proveedor por nombre o NIF..."
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
              title="Nuevo Proveedor"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isOpen && filteredProveedores.length > 0 && (
          <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg" style={{ zIndex: 1050 }}>
            {filteredProveedores.map((proveedor) => (
              <div
                key={proveedor.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(proveedor)}
                style={{ cursor: 'pointer' }}
              >
                <div className="font-medium">{proveedor.nombre}</div>
                <div className="text-sm text-gray-600">{proveedor.nif}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProveedorModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleNewProveedorSuccess}
      />
    </>
  );
}