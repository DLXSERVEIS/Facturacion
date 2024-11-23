import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | File;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="pdf-viewer">
      <div className="controls mb-3">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-default"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="btn btn-default disabled">
            Página {pageNumber} de {numPages}
          </span>
          <button
            type="button"
            className="btn btn-default"
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
            }
            disabled={pageNumber >= (numPages || 1)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="btn-group ml-2">
          <button
            type="button"
            className="btn btn-default"
            onClick={zoomOut}
            disabled={scale <= 0.5}
          >
            <i className="fas fa-search-minus"></i>
          </button>
          <span className="btn btn-default disabled">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className="btn btn-default"
            onClick={zoomIn}
            disabled={scale >= 2.0}
          >
            <i className="fas fa-search-plus"></i>
          </button>
        </div>
      </div>

      <div className="document-container" style={{ overflow: 'auto' }}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div>Cargando documento...</div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}