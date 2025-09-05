import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { mockData } from '../services/mockData';

const Agenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 6, 23)); // July 23, 2024

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();

  const daysInMonth = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const today = new Date();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Agenda</h1>
        <div className="flex items-center space-x-2">
          <button onClick={prevMonth} className="p-2 rounded-md hover:bg-slate-200">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-slate-700 w-40 text-center">
            {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-md hover:bg-slate-200">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-slate-500 text-sm mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array(startDay).fill(null).map((_, i) => <div key={`empty-${i}`}></div>)}
          {daysInMonth.map(day => {
            const dateString = day.toISOString().split('T')[0];
            const appointments = mockData.calendarAppointments[dateString] || [];
            const isToday = day.toDateString() === today.toDateString();

            return (
              <div key={day.toString()} className={`p-2 border rounded-lg h-32 flex flex-col ${isToday ? 'border-purple-500 bg-purple-50' : 'border-slate-200'}`}>
                <span className={`font-bold ${isToday ? 'text-purple-600' : 'text-slate-600'}`}>{day.getDate()}</span>
                <div className="mt-1 space-y-1 overflow-y-auto">
                  {appointments.map(apt => (
                    <div key={apt.time} className="bg-purple-200 text-purple-800 text-xs p-1 rounded">
                      {apt.time} - {apt.patient.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
