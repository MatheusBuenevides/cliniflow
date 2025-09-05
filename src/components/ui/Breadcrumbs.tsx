import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/', isActive: location.pathname === '/' }
    ];

    if (pathSegments.length === 0) {
      return breadcrumbs;
    }

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      let label = '';
      switch (segment) {
        case 'agenda':
          label = 'Agenda';
          break;
        case 'pacientes':
          label = 'Pacientes';
          break;
        case 'financeiro':
          label = 'Financeiro';
          break;
        case 'configuracoes':
          label = 'Configurações';
          break;
        default:
          // Se for um ID numérico, assume que é detalhe de paciente
          if (/^\d+$/.test(segment)) {
            label = 'Detalhes do Paciente';
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link
        to="/"
        className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Início</span>
      </Link>
      
      {breadcrumbs.slice(1).map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {breadcrumb.isActive ? (
            <span className="text-gray-900 font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="hover:text-purple-600 transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
