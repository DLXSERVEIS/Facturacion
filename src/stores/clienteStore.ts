import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Cliente {
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
const clientesIniciales: Cliente[] = [
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

interface ClienteStore {
  clientes: Cliente[];
  addCliente: (cliente: Cliente) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
}

export const useClienteStore = create<ClienteStore>()(
  persist(
    (set) => ({
      clientes: clientesIniciales, // Inicializamos con datos de ejemplo
      addCliente: (cliente) =>
        set((state) => ({
          clientes: [...state.clientes, cliente],
        })),
      updateCliente: (id, cliente) =>
        set((state) => ({
          clientes: state.clientes.map((c) =>
            c.id === id ? { ...c, ...cliente } : c
          ),
        })),
      deleteCliente: (id) =>
        set((state) => ({
          clientes: state.clientes.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'cliente-storage',
    }
  )
);