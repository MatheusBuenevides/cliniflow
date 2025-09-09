import React from 'react';
import type { ConnectionQuality } from '../../types';

interface ConnectionStatusProps {
  quality: ConnectionQuality | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ quality }) => {
  if (!quality) {
    return (
      <div className="flex items-center space-x-2 text-slate-400">
        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
        <span className="text-sm">Verificando conexão...</span>
      </div>
    );
  }

  const getQualityColor = (qualityLevel: string) => {
    switch (qualityLevel) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-yellow-500';
      case 'fair':
        return 'text-orange-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-slate-400';
    }
  };

  const getQualityIcon = (qualityLevel: string) => {
    switch (qualityLevel) {
      case 'excellent':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'good':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'fair':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'poor':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getQualityText = (qualityLevel: string) => {
    switch (qualityLevel) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Boa';
      case 'fair':
        return 'Regular';
      case 'poor':
        return 'Ruim';
      default:
        return 'Desconhecida';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Status de Vídeo */}
      <div className="flex items-center space-x-1">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span className={`text-sm font-medium ${getQualityColor(quality.video)}`}>
          {getQualityText(quality.video)}
        </span>
      </div>

      {/* Status de Áudio */}
      <div className="flex items-center space-x-1">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <span className={`text-sm font-medium ${getQualityColor(quality.audio)}`}>
          {getQualityText(quality.audio)}
        </span>
      </div>

      {/* Latência */}
      <div className="flex items-center space-x-1">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-sm text-slate-400">
          {quality.latency}ms
        </span>
      </div>

      {/* Indicador Geral */}
      <div className="flex items-center space-x-1">
        {getQualityIcon(quality.video)}
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
