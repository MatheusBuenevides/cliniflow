import React, { useState, useRef } from 'react';
import { 
  Paperclip, 
  Upload, 
  File, 
  X, 
  Download, 
  Eye,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useSessionStore } from '../../stores/useSessionStore';
import type { SessionAttachment } from '../../types';

interface AttachmentUploaderProps {
  sessionId: number;
  attachments: SessionAttachment[];
  maxFileSize?: number; // em MB
  allowedTypes?: string[];
  maxFiles?: number;
}

const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  sessionId,
  attachments,
  maxFileSize = 10,
  allowedTypes = ['image/*', 'application/pdf', 'text/*'],
  maxFiles = 5
}) => {
  const { uploadAttachment } = useSessionStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Validações
    if (attachments.length + fileArray.length > maxFiles) {
      setUploadError(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    for (const file of fileArray) {
      if (file.size > maxFileSize * 1024 * 1024) {
        setUploadError(`Arquivo ${file.name} excede o limite de ${maxFileSize}MB`);
        return;
      }

      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        setUploadError(`Tipo de arquivo ${file.type} não é permitido`);
        return;
      }
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      for (const file of fileArray) {
        await uploadAttachment(sessionId, file, `Anexo da sessão ${sessionId}`);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType === 'application/pdf') {
      return '📄';
    } else if (fileType.startsWith('text/')) {
      return '📝';
    } else {
      return '📎';
    }
  };

  return (
    <div className="space-y-4">
      {/* Área de upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-purple-400 bg-purple-50'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading || attachments.length >= maxFiles}
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-slate-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">
              {isUploading ? 'Fazendo upload...' : 'Arraste arquivos aqui ou clique para selecionar'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Máximo {maxFiles} arquivos, até {maxFileSize}MB cada
            </p>
            <p className="text-xs text-slate-500">
              Tipos permitidos: Imagens, PDF, Texto
            </p>
          </div>

          {attachments.length >= maxFiles && (
            <p className="text-sm text-amber-600">
              Limite de arquivos atingido
            </p>
          )}
        </div>
      </div>

      {/* Erro de upload */}
      {uploadError && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Lista de anexos */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Anexos ({attachments.length})</h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getFileIcon(attachment.fileType)}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {attachment.originalName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(attachment.fileSize)} • {attachment.fileType}
                    </p>
                    {attachment.description && (
                      <p className="text-xs text-slate-600 mt-1">
                        {attachment.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {attachment.isEncrypted && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Criptografado</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        // Em produção, isso faria download do arquivo
                        console.log('Download:', attachment.fileName);
                      }}
                      className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                      title="Baixar arquivo"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        // Em produção, isso abriria o arquivo em uma nova aba
                        console.log('Visualizar:', attachment.fileName);
                      }}
                      className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                      title="Visualizar arquivo"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { AttachmentUploader };
