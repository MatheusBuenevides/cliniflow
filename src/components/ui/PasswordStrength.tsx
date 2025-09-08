import React from 'react';
import { Check, X } from 'lucide-react';

export interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthRule {
  label: string;
  test: (password: string) => boolean;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className = '' }) => {
  const rules: StrengthRule[] = [
    {
      label: 'Pelo menos 8 caracteres',
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: 'Pelo menos 1 letra minúscula',
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      label: 'Pelo menos 1 letra maiúscula',
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: 'Pelo menos 1 número',
      test: (pwd) => /\d/.test(pwd),
    },
    {
      label: 'Pelo menos 1 caractere especial',
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const getStrengthLevel = (password: string): { level: number; label: string; color: string } => {
    const passedRules = rules.filter(rule => rule.test(password)).length;
    const percentage = (passedRules / rules.length) * 100;

    if (percentage < 40) {
      return { level: 1, label: 'Fraca', color: 'bg-red-500' };
    } else if (percentage < 80) {
      return { level: 2, label: 'Média', color: 'bg-yellow-500' };
    } else {
      return { level: 3, label: 'Forte', color: 'bg-green-500' };
    }
  };

  const strength = getStrengthLevel(password);

  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Força da senha:</span>
          <span className={`font-medium ${
            strength.level === 1 ? 'text-red-600' :
            strength.level === 2 ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {strength.label}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{
              width: `${(strength.level / 3) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-2">
        {rules.map((rule, index) => {
          const isValid = rule.test(password);
          return (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className={`flex-shrink-0 ${
                isValid ? 'text-green-500' : 'text-gray-400'
              }`}>
                {isValid ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </div>
              <span className={`${
                isValid ? 'text-green-700' : 'text-gray-500'
              }`}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;
