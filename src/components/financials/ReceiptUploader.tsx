import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  Download, 
  Eye, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import type { ReceiptFile } from '../../types';

interface ReceiptUploaderProps {
  receiptFile?: ReceiptFile | null;
  onFileSelect: (file: File | null) => void;
  onFileRemove?: () => void;
  onFileView?: (file: ReceiptFile) => void;
  onFileDownload?: (file: ReceiptFile) => void;
  maxSize?: number; // em MB
  acceptedTypes?: string[];
  isLoading?: boolean;
  error?: string;
}

const DEFAULT_MAX_SIZE = 5; // 5MB
const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'application/pdf'
];

const FILE_TYPE_ICONS = {
  'image/jpeg': Image,
  'image/jpg': Image,
  'image/png': Image,
  'application/pdf': FileText,
  'default': File
};

const FILE_TYPE_LABELS = {
  'image/jpeg': 'JPEG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
  'application/pdf': 'PDF'
};

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({
  receiptFile,
  onFileSelect,
  onFileRemove,
  onFileView,
  onFileDownload,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  isLoading = false,
  error
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadError('');

    // Validar tipo de arquivo
    if (!acceptedTypes.includes(file.type)) {
      const acceptedExtensions = acceptedTypes
        .map(type => type.split('/')[1].toUpperCase())
        .join(', ');
      setUploadError(`Tipo de arquivo não suportado. Tipos aceitos: ${acceptedExtensions}`);
      return;
    }

    // Validar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (onFileRemove) {
      onFileRemove();
    }
    setUploadError('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    const Icon = FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS] || FILE_TYPE_ICONS.default;
    return <Icon className="w-6 h-6" />;
  };

  const getFileTypeLabel = (fileType: string): string => {
    return FILE_TYPE_LABELS[fileType as keyof typeof FILE_TYPE_LABELS] || 'Arquivo';
  };

  const getAcceptedExtensions = (): string => {
    return acceptedTypes
      .map(type => `.${type.split('/')[1]}`)
      .join(', ');
  };

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      {!receiptFile && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            accept={acceptedTypes.join(',')}
            className="hidden"
          />

          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Fazendo upload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Arraste e solte o arquivo aqui, ou{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  clique para selecionar
                </button>
              </p>
              <p className="text-xs text-gray-500">
                {getAcceptedExtensions()} (máximo {maxSize}MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Arquivo Selecionado */}
      {receiptFile && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getFileIcon(receiptFile.fileType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {receiptFile.originalName}
                </p>
                <p className="text-sm text-gray-500">
                  {getFileTypeLabel(receiptFile.fileType)} • {formatFileSize(receiptFile.fileSize)}
                </p>
                <p className="text-xs text-gray-400">
                  Enviado em {new Date(receiptFile.uploadedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {onFileView && (
                <button
                  onClick={() => onFileView(receiptFile)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  title="Visualizar"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              
              {onFileDownload && (
                <button
                  onClick={() => onFileDownload(receiptFile)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={handleRemove}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Status do arquivo */}
          <div className="mt-3 flex items-center space-x-2">
            {receiptFile.isEncrypted ? (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Arquivo criptografado
              </div>
            ) : (
              <div className="flex items-center text-xs text-yellow-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Arquivo não criptografado
              </div>
            )}
          </div>
        </div>
      )}

      {/* Erros */}
      {(error || uploadError) && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">
            {error || uploadError}
          </p>
        </div>
      )}

      {/* Informações de Segurança */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Segurança dos Arquivos</p>
            <ul className="text-xs space-y-1">
              <li>• Arquivos são armazenados de forma segura e criptografada</li>
              <li>• Apenas você tem acesso aos seus comprovantes</li>
              <li>• Arquivos são automaticamente removidos após o período de retenção</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para visualização de arquivos
interface FileViewerProps {
  file: ReceiptFile;
  onClose: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ file, onClose }) => {
  const isImage = file.fileType.startsWith('image/');
  const isPDF = file.fileType === 'application/pdf';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-full w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {file.originalName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 max-h-96 overflow-auto">
          {isImage ? (
            <img
              src={file.url}
              alt={file.originalName}
              className="max-w-full h-auto mx-auto"
            />
          ) : isPDF ? (
            <iframe
              src={file.url}
              className="w-full h-96 border-0"
              title={file.originalName}
            />
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Visualização não disponível para este tipo de arquivo
              </p>
              <a
                href={file.url}
                download={file.originalName}
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Arquivo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
