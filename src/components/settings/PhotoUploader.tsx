import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface PhotoUploaderProps {
  currentPhoto?: string;
  onPhotoChange: (photo: string | null) => void;
  className?: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentPhoto,
  onPhotoChange,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Simular upload - em produção, enviar para servidor
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onPhotoChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-32 h-32 mx-auto">
        {preview ? (
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={preview}
              alt="Foto do perfil"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="w-full h-full rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition-colors bg-slate-50"
          >
            <Camera size={24} className="text-slate-400 mb-2" />
            <span className="text-xs text-slate-500 text-center px-2">
              Adicionar foto
            </span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="mt-4 text-center">
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <Upload size={16} className="mr-2" />
          {preview ? 'Alterar foto' : 'Adicionar foto'}
        </button>
      </div>

      <p className="text-xs text-slate-500 text-center mt-2">
        JPG, PNG ou GIF. Máximo 5MB.
      </p>
    </div>
  );
};

export default PhotoUploader;
