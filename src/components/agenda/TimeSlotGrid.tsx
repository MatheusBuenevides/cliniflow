import React, { useState } from 'react';
import { Clock, MapPin, Video, Check, X } from 'lucide-react';
import type { TimeSlot } from '../../types/booking';
import type { SessionModality } from '../../types';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlot?: TimeSlot;
  onSlotSelect: (slot: TimeSlot) => void;
  onModalityChange: (slotId: string, modality: SessionModality) => void;
  className?: string;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  selectedSlot,
  onSlotSelect,
  onModalityChange,
  className = ''
}) => {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const getModalityIcon = (modality: SessionModality) => {
    return modality === 'online' ? (
      <Video className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  };

  const getModalityColor = (modality: SessionModality) => {
    return modality === 'online' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getModalityLabel = (modality: SessionModality) => {
    return modality === 'online' ? 'Online' : 'Presencial';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDuration = (duration: number) => {
    if (duration === 60) return '1h';
    if (duration === 30) return '30min';
    if (duration === 45) return '45min';
    return `${duration}min`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Agrupar slots por horário
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.time]) {
      acc[slot.time] = [];
    }
    acc[slot.time].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium text-slate-800">Horários disponíveis</h3>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Selecione um horário e escolha a modalidade da consulta
        </p>
      </div>

      <div className="p-6">
        {Object.keys(groupedSlots).length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">Nenhum horário disponível</p>
            <p className="text-sm text-slate-400">Tente selecionar outra data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSlots)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([time, timeSlots]) => (
                <div key={time} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-slate-800">
                        {formatTime(time)}
                      </span>
                      <span className="text-sm text-slate-500">
                        ({formatDuration(timeSlots[0].duration)})
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatPrice(timeSlots[0].price)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {timeSlots.map(slot => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const isHovered = hoveredSlot === slot.id;
                      const isAvailable = slot.isAvailable && !slot.isBlocked;

                      return (
                        <div
                          key={slot.id}
                          className={`
                            relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                            ${isAvailable 
                              ? isSelected
                                ? 'border-purple-500 bg-purple-50'
                                : isHovered
                                ? 'border-purple-300 bg-purple-25'
                                : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                              : 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                            }
                          `}
                          onClick={() => isAvailable && onSlotSelect(slot)}
                          onMouseEnter={() => setHoveredSlot(slot.id)}
                          onMouseLeave={() => setHoveredSlot(null)}
                        >
                          {/* Indicador de seleção */}
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Modalidade */}
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`
                              flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border
                              ${getModalityColor(slot.modality)}
                            `}>
                              {getModalityIcon(slot.modality)}
                              <span>{getModalityLabel(slot.modality)}</span>
                            </div>
                          </div>

                          {/* Informações do slot */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">
                                {getModalityLabel(slot.modality)}
                              </span>
                              <span className="text-sm font-semibold text-slate-800">
                                {formatPrice(slot.price)}
                              </span>
                            </div>
                            
                            <div className="text-xs text-slate-500">
                              Duração: {formatDuration(slot.duration)}
                            </div>
                          </div>

                          {/* Status do slot */}
                          {!isAvailable && (
                            <div className="absolute inset-0 bg-slate-50 bg-opacity-75 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <X className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                                <p className="text-xs text-slate-500">
                                  {slot.reason || 'Indisponível'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Botões de modalidade (apenas para slots disponíveis) */}
                          {isAvailable && (
                            <div className="mt-3 flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onModalityChange(slot.id, 'inPerson');
                                }}
                                className={`
                                  flex-1 flex items-center justify-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors
                                  ${slot.modality === 'inPerson'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-700'
                                  }
                                `}
                              >
                                <MapPin className="h-3 w-3" />
                                <span>Presencial</span>
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onModalityChange(slot.id, 'online');
                                }}
                                className={`
                                  flex-1 flex items-center justify-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors
                                  ${slot.modality === 'online'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                  }
                                `}
                              >
                                <Video className="h-3 w-3" />
                                <span>Online</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Resumo da seleção */}
      {selectedSlot && (
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-800">Horário selecionado:</h4>
              <p className="text-sm text-slate-600">
                {new Date(selectedSlot.date).toLocaleDateString('pt-BR')} às {formatTime(selectedSlot.time)}
              </p>
              <p className="text-sm text-slate-600">
                {getModalityLabel(selectedSlot.modality)} • {formatDuration(selectedSlot.duration)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-800">
                {formatPrice(selectedSlot.price)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotGrid;
