import React, { useRef, useState } from 'react';
import { Upload, Camera, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function FileUpload({ onFileSelect, selectedFile, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten archivos PDF o JPG');
      return;
    }

    if (file.size > maxSize) {
      alert('El archivo no debe superar los 5MB');
      return;
    }

    onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (err) {
      alert('Error al acceder a la cámara');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            validateAndProcessFile(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="form-group">
      <label>Adjuntar archivo (PDF o JPG, máx. 5MB)</label>
      <div
        className={`border-2 border-dashed p-6 text-center ${
          isDragging ? 'border-primary bg-gray-100' : 'border-gray-300'
        } rounded-lg cursor-pointer mb-3`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="text-sm">{selectedFile.name}</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            >
              <X size={20} />
            </button>
          </div>
        ) : showCamera ? (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md mx-auto border rounded"
            />
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={takePhoto}
              >
                Capturar foto
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={stopCamera}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-gray-600">
              Arrastra y suelta un archivo aquí
            </div>
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => fileInputRef.current?.click()}
              >
                selecciona un archivo
              </button>
              <span>o</span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={startCamera}
              >
                toma una foto
              </button>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.jpg,.jpeg"
        onChange={handleFileInput}
      />
    </div>
  );
}