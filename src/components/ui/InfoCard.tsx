import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  colorClass?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  colorClass = 'text-purple-600' 
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start space-x-4">
    <div className={`p-3 rounded-full bg-purple-100 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  </div>
);

export default InfoCard;
