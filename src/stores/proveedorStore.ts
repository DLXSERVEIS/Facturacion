import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Proveedor {
  id: string;
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

// Datos iniciales de ejemplo
const proveedoresIniciales: Proveedor[] = [
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

interface ProveedorStore {
  proveedores: Proveedor[];
  addProveedor: (proveedor: Proveedor) => void;
  updateProveedor: (id: string, proveedor: Partial<Proveedor>) => void;
  deleteProveedor: (id: string) => void;
}

export const useProveedorStore = create<ProveedorStore>()(
  persist(
    (set) => ({
      proveedores: proveedoresIniciales, // Inicializamos con datos de ejemplo
      addProveedor: (proveedor) =>
        set((state) => ({
          proveedores: [...state.proveedores, proveedor],
        })),
      updateProveedor: (id, proveedor) =>
        set((state) => ({
          proveedores: state.proveedores.map((p) =>
            p.id === id ? { ...p, ...proveedor } : p
          ),
        })),
      deleteProveedor: (id) =>
        set((state) => ({
          proveedores: state.proveedores.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'proveedor-storage',
    }
  )
);