import React from 'react';

interface SpecialtyBadgeProps {
  specialty: string;
  variant?: 'default' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

const SpecialtyBadge: React.FC<SpecialtyBadgeProps> = ({ 
  specialty, 
  variant = 'default', 
  size = 'md' 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-200 hover:scale-105";
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const variantClasses = {
    default: "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200",
    outline: "bg-transparent text-purple-600 border-2 border-purple-300 hover:bg-purple-50",
    gradient: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg"
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;

  return (
    <span className={classes}>
      {specialty}
    </span>
  );
};

export default SpecialtyBadge;
