import React, { useRef } from 'react';
import Draggable from 'react-draggable';

interface DraggableModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'lg' | undefined;
}

export default function DraggableModal({ 
  show, 
  onHide, 
  title, 
  children,
  size
}: DraggableModalProps) {
  const nodeRef = useRef(null);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <Draggable handle=".modal-header" nodeRef={nodeRef}>
        <div ref={nodeRef} className={`modal-dialog ${size ? `modal-${size}` : ''}`}>
          <div className="modal-content">
            <div className="modal-header" style={{ cursor: 'move' }}>
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" onClick={onHide}>
                <span>&times;</span>
              </button>
            </div>
            {children}
          </div>
        </div>
      </Draggable>
    </div>
  );
}