import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  Smartphone, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Download
} from 'lucide-react';
import type { PaymentLink } from '../../types';

interface PIXQRCodeProps {
  paymentLink: PaymentLink;
  onPaymentComplete: () => void;
  className?: string;
}

const PIXQRCode: React.FC<PIXQRCodeProps> = ({
  paymentLink,
  onPaymentComplete,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Simular countdown do tempo de expiração
  useEffect(() => {
    if (paymentLink.expiresAt) {
      const expiresAt = new Date(paymentLink.expiresAt);
      const now = new Date();
      const diffInSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      
      setTimeLeft(diffInSeconds);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentLink.expiresAt]);

  const handleCopyPixCode = async () => {
    try {
      if (paymentLink.pixCode) {
        await navigator.clipboard.writeText(paymentLink.pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Erro ao copiar código PIX:', error);
    }
  };

  const handleSimulatePayment = () => {
    setIsSimulatingPayment(true);
    
    // Simular processo de pagamento
    setTimeout(() => {
      setIsSimulatingPayment(false);
      onPaymentComplete();
    }, 3000);
  };

  const handleDownloadQRCode = () => {
    // Simular download do QR Code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 200;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText('QR Code PIX', 50, 100);
      
      const link = document.createElement('a');
      link.download = 'pix-qrcode.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Pagamento via PIX
        </h3>
        
        <p className="text-slate-600 text-sm">
          Escaneie o QR Code ou copie o código PIX para pagar
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-48 h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
            {paymentLink.qrCode ? (
              <img 
                src={paymentLink.qrCode} 
                alt="QR Code PIX" 
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center">
                <QrCode className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">QR Code PIX</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleDownloadQRCode}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors"
            title="Baixar QR Code"
          >
            <Download className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Informações do pagamento */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Valor:</span>
            <span className="font-bold text-lg text-slate-800">
              {formatPrice(paymentLink.amount)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Descrição:</span>
            <span className="text-sm text-slate-700 text-right max-w-48">
              {paymentLink.description}
            </span>
          </div>

          {timeLeft > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Expira em:</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="font-mono text-amber-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Código PIX */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Código PIX (Copiar e colar no app do seu banco):
        </label>
        
        <div className="relative">
          <textarea
            value={paymentLink.pixCode || ''}
            readOnly
            className="w-full p-3 pr-12 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg resize-none"
            rows={4}
            placeholder="Código PIX será gerado aqui..."
          />
          
          <button
            onClick={handleCopyPixCode}
            className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            title="Copiar código PIX"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-2">
          <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Como pagar com PIX:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Abra o app do seu banco</li>
              <li>Escolha a opção PIX</li>
              <li>Escaneie o QR Code ou cole o código PIX</li>
              <li>Confirme o pagamento</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="space-y-3">
        <button
          onClick={handleSimulatePayment}
          disabled={isSimulatingPayment || timeLeft === 0}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSimulatingPayment ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processando pagamento...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Simular Pagamento (Demo)</span>
            </>
          )}
        </button>

        <button
          onClick={() => window.open(paymentLink.url, '_blank')}
          className="w-full flex items-center justify-center space-x-2 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Abrir em nova aba</span>
        </button>
      </div>

      {/* Aviso de expiração */}
      {timeLeft === 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">
              Este link de pagamento expirou. Solicite um novo link.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export { PIXQRCode };
