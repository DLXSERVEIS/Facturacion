import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Factura {
  id: string;
  tipo: 'compra' | 'venta';
  numero: string;
  fecha: string;
  fechaVencimiento: string;
  cliente: string;
  total: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
  fechaPago?: string;
  archivo?: {
    nombre: string;
    url: string;
    tipo: string;
  };
}

interface FacturaStore {
  facturas: Factura[];
  addFactura: (factura: Factura) => void;
  updateFactura: (id: string, factura: Partial<Factura>) => void;
  deleteFactura: (id: string) => void;
  marcarComoPagada: (id: string, fechaPago: string) => void;
  marcarComoPendiente: (id: string) => void;
}

export const useFacturaStore = create<FacturaStore>()(
  persist(
    (set) => ({
      facturas: [],
      addFactura: (factura) =>
        set((state) => ({
          facturas: [...state.facturas, factura],
        })),
      updateFactura: (id, factura) =>
        set((state) => ({
          facturas: state.facturas.map((f) =>
            f.id === id ? { ...f, ...factura } : f
          ),
        })),
      deleteFactura: (id) =>
        set((state) => ({
          facturas: state.facturas.filter((f) => f.id !== id),
        })),
      marcarComoPagada: (id, fechaPago) =>
        set((state) => ({
          facturas: state.facturas.map((f) =>
            f.id === id ? { ...f, estado: 'pagada', fechaPago } : f
          ),
        })),
      marcarComoPendiente: (id) =>
        set((state) => ({
          facturas: state.facturas.map((f) =>
            f.id === id ? { ...f, estado: 'pendiente', fechaPago: undefined } : f
          ),
        })),
    }),
    {
      name: 'factura-storage',
    }
  )
);