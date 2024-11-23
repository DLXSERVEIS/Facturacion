import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FilePreviewProps {
  file: File | null;
}

export default function FilePreview({ file }: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  if (!file || !preview) return null;

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  if (file.type.startsWith('image/')) {
    return (
      <div className="file-preview mt-2">
        <div className="text-center mb-2">
          <div className="btn-group">
            <button type="button" className="btn btn-default" onClick={zoomOut}>
              <i className="fas fa-search-minus"></i>
            </button>
            <span className="btn btn-default disabled">
              {Math.round(scale * 100)}%
            </span>
            <button type="button" className="btn btn-default" onClick={zoomIn}>
              <i className="fas fa-search-plus"></i>
            </button>
          </div>
        </div>
        <div className="preview-container" style={{ overflow: 'auto', maxHeight: '400px' }}>
          <img
            src={preview}
            alt="Preview"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            className="img-fluid"
          />
        </div>
      </div>
    );
  }

  if (file.type === 'application/pdf') {
    return (
      <div className="file-preview mt-2">
        <div className="text-center mb-2">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-default"
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="btn btn-default disabled">
              Página {pageNumber} de {numPages || '?'}
            </span>
            <button
              type="button"
              className="btn btn-default"
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
              disabled={pageNumber >= (numPages || 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div className="btn-group ml-2">
            <button type="button" className="btn btn-default" onClick={zoomOut}>
              <i className="fas fa-search-minus"></i>
            </button>
            <span className="btn btn-default disabled">
              {Math.round(scale * 100)}%
            </span>
            <button type="button" className="btn btn-default" onClick={zoomIn}>
              <i className="fas fa-search-plus"></i>
            </button>
          </div>
        </div>
        <div className="preview-container" style={{ overflow: 'auto', maxHeight: '400px' }}>
          <Document
            file={preview}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
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

  return null;
}