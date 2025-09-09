import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Calendar,
  AlertCircle,
  ExternalLink,
  Clock
} from 'lucide-react';

interface BoletoViewerProps {
  boletoData: {
    id: string;
    amount: number;
    dueDate: string;
    barcode: string;
    digitableLine: string;
    payerName: string;
    payerDocument: string;
    description: string;
    url: string;
    status: 'pending' | 'paid' | 'expired';
  };
  onPaymentComplete: () => void;
  className?: string;
}

const BoletoViewer: React.FC<BoletoViewerProps> = ({
  boletoData,
  onPaymentComplete,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCopyBarcode = async () => {
    try {
      await navigator.clipboard.writeText(boletoData.barcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar código de barras:', error);
    }
  };

  const handleSimulatePayment = () => {
    setIsSimulatingPayment(true);
    
    setTimeout(() => {
      setIsSimulatingPayment(false);
      onPaymentComplete();
    }, 3000);
  };

  const handleDownloadBoleto = () => {
    // Simular download do boleto
    const link = document.createElement('a');
    link.href = boletoData.url;
    link.download = `boleto-${boletoData.id}.pdf`;
    link.click();
  };

  const handlePrintBoleto = () => {
    window.open(boletoData.url, '_blank');
  };

  const isExpired = new Date(boletoData.dueDate) < new Date();
  const daysUntilDue = Math.ceil((new Date(boletoData.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-orange-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Boleto Bancário
        </h3>
        
        <p className="text-slate-600 text-sm">
          Pague em qualquer banco, lotérica ou internet banking
        </p>
      </div>

      {/* Status do Boleto */}
      <div className={`rounded-lg p-4 mb-6 ${
        boletoData.status === 'paid' ? 'bg-green-50 border border-green-200' :
        isExpired ? 'bg-red-50 border border-red-200' :
        'bg-amber-50 border border-amber-200'
      }`}>
        <div className="flex items-center space-x-2">
          {boletoData.status === 'paid' ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : isExpired ? (
            <AlertCircle className="h-5 w-5 text-red-600" />
          ) : (
            <Clock className="h-5 w-5 text-amber-600" />
          )}
          <span className={`font-medium ${
            boletoData.status === 'paid' ? 'text-green-800' :
            isExpired ? 'text-red-800' :
            'text-amber-800'
          }`}>
            {boletoData.status === 'paid' ? 'Boleto Pago' :
             isExpired ? 'Boleto Vencido' :
             `Vence em ${daysUntilDue} dia${daysUntilDue !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Informações do Boleto */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Valor:</span>
            <span className="font-bold text-lg text-slate-800">
              {formatPrice(boletoData.amount)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Vencimento:</span>
            <span className="text-slate-700">
              {formatDate(boletoData.dueDate)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600">Pagador:</span>
            <span className="text-slate-700 text-right max-w-48">
              {boletoData.payerName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600">CPF/CNPJ:</span>
            <span className="text-slate-700">
              {boletoData.payerDocument}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-slate-600">Descrição:</span>
            <span className="text-slate-700 text-right max-w-48">
              {boletoData.description}
            </span>
          </div>
        </div>
      </div>

      {/* Linha Digitável */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Linha Digitável:
        </label>
        
        <div className="relative">
          <input
            type="text"
            value={boletoData.digitableLine}
            readOnly
            className="w-full p-3 pr-12 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg"
          />
          
          <button
            onClick={handleCopyBarcode}
            className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            title="Copiar linha digitável"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Código de Barras */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Código de Barras:
        </label>
        
        <div className="relative">
          <input
            type="text"
            value={boletoData.barcode}
            readOnly
            className="w-full p-3 pr-12 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg"
          />
          
          <button
            onClick={handleCopyBarcode}
            className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            title="Copiar código de barras"
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
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Como pagar:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Copie a linha digitável ou código de barras</li>
              <li>Acesse seu internet banking ou app do banco</li>
              <li>Escolha "Pagar Boleto" ou "Pagar Conta"</li>
              <li>Cole o código e confirme o pagamento</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-3">
        {boletoData.status !== 'paid' && !isExpired && (
          <button
            onClick={handleSimulatePayment}
            disabled={isSimulatingPayment}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSimulatingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Simulando pagamento...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Simular Pagamento (Demo)</span>
              </>
            )}
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadBoleto}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Baixar PDF</span>
          </button>

          <button
            onClick={handlePrintBoleto}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir</span>
          </button>
        </div>

        <button
          onClick={() => window.open(boletoData.url, '_blank')}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Abrir em nova aba</span>
        </button>
      </div>

      {/* Aviso de vencimento */}
      {isExpired && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">
              Este boleto está vencido. Entre em contato para gerar um novo boleto.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export { BoletoViewer };
