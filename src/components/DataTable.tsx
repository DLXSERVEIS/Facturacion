import { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';

interface DataTableProps {
  id: string;
  columns: string[];
  children: React.ReactNode;
}

export default function DataTable({ id, columns, children }: DataTableProps) {
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    const initializeDataTable = () => {
      if (!tableRef.current) return;

      // Si ya existe una instancia, destruirla primero
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }

      // Inicializar nueva instancia
      const table = $(tableRef.current);
      dataTableRef.current = table.DataTable({
        destroy: true, // Permite reinicialización
        responsive: true,
        searching: false, // Desactivar búsqueda de DataTables
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        dom: 'Bfrtip',
        buttons: [
          'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        drawCallback: function() {
          // Ajustar responsive después de dibujar
          if (dataTableRef.current) {
            dataTableRef.current.responsive.recalc();
          }
        }
      });
    };

    // Pequeño delay para asegurar que el DOM está listo
    const timer = setTimeout(initializeDataTable, 100);

    return () => {
      clearTimeout(timer);
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [id, children]); // Reinicializar cuando cambien los datos o el id

  return (
    <div className="table-responsive">
      <table ref={tableRef} id={id} className="table table-bordered table-striped">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}