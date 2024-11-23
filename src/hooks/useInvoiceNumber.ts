import { useFacturaStore } from '../stores/facturaStore';

export function useInvoiceNumber(tipo: 'venta' | 'compra') {
  const facturas = useFacturaStore(state => 
    state.facturas.filter(f => f.tipo === tipo)
  );

  const getNextNumber = () => {
    const prefix = tipo === 'venta' ? 'FV' : 'FC';
    const currentYear = new Date().getFullYear();
    
    // Encontrar el último número usado
    const lastNumber = facturas
      .map(f => {
        const match = f.numero.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .reduce((max, current) => Math.max(max, current), 0);

    // Generar el siguiente número
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
    return `${prefix}-${currentYear}-${nextNumber}`;
  };

  return getNextNumber();
}